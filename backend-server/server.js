import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import places from './routes/places.js'
import studentsRoutes from "./routes/students.js";
import advisersRoutes from "./routes/advisers.js";
import coursesRoutes from "./routes/courses.js";
import residenceStaffRoutes from "./routes/residenceStaff.js";
import hallsRoutes from "./routes/halls.js";
import hallRoomsRoutes from "./routes/hallRooms.js";
import apartmentsRoutes from "./routes/apartments.js";
import apartmentRoomsRoutes from "./routes/apartmentRooms.js";
import leasesRoutes from "./routes/leases.js";
import invoicesRoutes from "./routes/invoices.js";
import inspectionsRoutes from "./routes/apartmentInspections.js";
import kinRoutes from "./routes/nextOfKin.js";
import reportsRoutes from "./routes/reports.js";

import pool from "./db.js";

// LOAD ENV
dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

// ENV VARIABLES
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
const frontendDistDir = path.join(__dirname, "../frontend/dist");

// create uploads folder
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Session Store Setup
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, pool);

// middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(express.static(frontendDistDir));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(session({
  key: "session_cookie_name",
  secret: SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day session persistence
  }
}));

// ================= WARM UP =================

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ================= AUTH =================

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = { username };
    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
};

// ================= ROUTES =================

app.use("/api/students", isAuthenticated, studentsRoutes);
app.use("/api/advisers", isAuthenticated, advisersRoutes);
app.use("/api/courses", isAuthenticated, coursesRoutes);
app.use("/api/staff", isAuthenticated, residenceStaffRoutes);
app.use("/api/halls", isAuthenticated, hallsRoutes);
app.use("/api/hallrooms", isAuthenticated, hallRoomsRoutes);
app.use("/api/apartments", isAuthenticated, apartmentsRoutes);
app.use("/api/apartmentrooms", isAuthenticated, apartmentRoomsRoutes);
app.use("/api/leases", isAuthenticated, leasesRoutes);
app.use("/api/invoices", isAuthenticated, invoicesRoutes);
app.use("/api/inspections", isAuthenticated, inspectionsRoutes);
app.use("/api/kin", isAuthenticated, kinRoutes);
app.use("/api/places", isAuthenticated, places);
app.use("/api/reports", isAuthenticated, reportsRoutes);

// ================= QUERY =================

app.post("/api/query", isAuthenticated, async (req, res) => {
  try {
    const { query } = req.body;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CSV =================

const allowedTables = new Set([
  "Students","Advisers","Courses","Residence_Staff","Halls",
  "Hall_Rooms","Apartments","Apartment_Rooms","Leases",
  "Invoices","Apartment_Inspections","Next_of_Kin","Places"
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const valid = file.mimetype.includes("csv") || file.originalname.endsWith(".csv");
    valid ? cb(null, true) : cb(new Error("Only CSV files allowed"));
  },
});

const removeFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

app.post("/api/upload-csv/:table", isAuthenticated, upload.single("file"), async (req, res) => {
  const table = req.params.table;
  const filePath = req.file?.path;

  if (!allowedTables.has(table)) {
    removeFileIfExists(filePath);
    return res.status(400).json({ error: "Invalid table" });
  }

  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      try {
        if (rows.length === 0) {
            removeFileIfExists(filePath);
            return res.status(400).json({ error: "CSV file is empty" });
        }
        const columns = Object.keys(rows[0]);
        const values = rows.map(r => columns.map(c => r[c]));

        const sql = `
          INSERT INTO \`${table}\` (${columns.map(c => `\`${c}\``).join(",")})
          VALUES ?
        `;

        await pool.query(sql, [values]);
        removeFileIfExists(filePath);

        res.json({ message: `Inserted ${rows.length} rows` });

      } catch (err) {
        removeFileIfExists(filePath);
        res.status(500).json({ error: err.message });
      }
    });
});

// ================= ERROR =================

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message });
});

app.get('/queryconsole', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./public/index.html"))
});

app.get('/*', (_req, res) => {
  res.sendFile(path.join(frontendDistDir, "index.html"));
});

// ================= START =================

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") startServer(port + 1);
  });
};

startServer(DEFAULT_PORT);
