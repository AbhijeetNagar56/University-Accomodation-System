# University Accommodation System – Backend Server

Backend server for the **University Accommodation System Android App**, built using **Node.js, Express, and MySQL**.  
This server manages student accommodation data such as students, leases, rooms, invoices, and inspections.

---

# Quick Links

**Android App:**
android app (udba.apk)<br>

**ER Diagram:**  
https://dbdiagram.io/d/69bbc8a978c6c4bc7a1fe414  <br>

**API Diagram:**  
https://miro.com/app/board/uXjVGqHM6t4=/?share_link_id=403010924186 <br>

--- 
# High level Diagram
<img src="./public/Database.png" alt="not ad">

**Login Page → Query Console Sample Query**

```sql
select * from Students;
```

## Tech Stack
**Frontend:** Android Studio, Kotlin, Jetpack Compose
**Backend:** Node.js, Express.js
**Database:** MySQL
**Authentication:** express-mysql-session
**Hosting:** Render (Backend)
**Database Hosting:** Railway
**File Uploads:** Multer
**Environment Management:** dotenv

## API Overview

The backend provides REST APIs to manage:

Students
Halls of Residence
Student Apartments
Leases
Invoices
Inspections
Staff
Authentication Sessions


## Database Information

### Database schema details are available in:

public/Database.txt

### Visual structure:

public/structure.png


## Deployment Details
Backend Hosting: Render (Free Tier)
Database Hosting: Railway

These platforms allow:

Cloud-based API hosting
Remote MySQL access
Scalable backend deployment


## Features Supported
Student accommodation management
Lease handling
Invoice and payment tracking
Inspection records
Authentication with session storage
RESTful API architecture
MySQL relational database integration


## License
This project is created for academic purposes as part of a University Database Management System project.
