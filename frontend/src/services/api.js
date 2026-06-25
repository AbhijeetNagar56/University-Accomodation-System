/**
 * API Service Layer
 * All backend communication goes through this module.
 * Requests are proxied via Vite: /api/* → http://localhost:3000/*
 */
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // needed for session cookies
  headers: { 'Content-Type': 'application/json' },
});

// ======================== AUTH ========================
export const login = (username, password) =>
  API.post('/login', { username, password });

export const logout = () => API.post('/logout');

// ======================== STUDENTS ========================
export const getStudents = () => API.get('/students');
export const getStudentById = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// ======================== ADVISERS ========================
export const getAdvisers = () => API.get('/advisers');
export const createAdviser = (data) => API.post('/advisers', data);
export const updateAdviser = (id, data) => API.put(`/advisers/${id}`, data);
export const deleteAdviser = (id) => API.delete(`/advisers/${id}`);

// ======================== COURSES ========================
export const getCourses = () => API.get('/courses');
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// ======================== STAFF ========================
export const getStaff = () => API.get('/staff');
export const createStaff = (data) => API.post('/staff', data);
export const updateStaff = (id, data) => API.put(`/staff/${id}`, data);
export const deleteStaff = (id) => API.delete(`/staff/${id}`);

// ======================== HALLS ========================
export const getHalls = () => API.get('/halls');
export const createHall = (data) => API.post('/halls', data);
export const updateHall = (id, data) => API.put(`/halls/${id}`, data);
export const deleteHall = (id) => API.delete(`/halls/${id}`);

// ======================== HALL ROOMS ========================
export const getHallRooms = () => API.get('/hallrooms');
export const getHallRoomById = (id) => API.get(`/hallrooms/${id}`);
export const createHallRoom = (data) => API.post('/hallrooms', data);
export const updateHallRoom = (id, data) => API.put(`/hallrooms/${id}`, data);
export const deleteHallRoom = (id) => API.delete(`/hallrooms/${id}`);

// ======================== APARTMENTS ========================
export const getApartments = () => API.get('/apartments');
export const createApartment = (data) => API.post('/apartments', data);
export const updateApartment = (id, data) => API.put(`/apartments/${id}`, data);
export const deleteApartment = (id) => API.delete(`/apartments/${id}`);

// ======================== APARTMENT ROOMS ========================
export const getApartmentRooms = () => API.get('/apartmentrooms');
export const getApartmentRoomById = (id) => API.get(`/apartmentrooms/${id}`);
export const createApartmentRoom = (data) => API.post('/apartmentrooms', data);
export const updateApartmentRoom = (id, data) => API.put(`/apartmentrooms/${id}`, data);
export const deleteApartmentRoom = (id) => API.delete(`/apartmentrooms/${id}`);

// ======================== LEASES ========================
export const getLeases = () => API.get('/leases');
export const createLease = (data) => API.post('/leases', data);
export const updateLease = (id, data) => API.put(`/leases/${id}`, data);
export const deleteLease = (id) => API.delete(`/leases/${id}`);

// ======================== INVOICES ========================
export const getInvoices = () => API.get('/invoices');
export const createInvoice = (data) => API.post('/invoices', data);
export const updateInvoice = (id, data) => API.put(`/invoices/${id}`, data);
export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);

// ======================== INSPECTIONS ========================
export const getInspections = () => API.get('/inspections');
export const createInspection = (data) => API.post('/inspections', data);
export const updateInspection = (id, data) => API.put(`/inspections/${id}`, data);
export const deleteInspection = (id) => API.delete(`/inspections/${id}`);

// ======================== NEXT OF KIN ========================
export const getNextOfKin = () => API.get('/kin');
export const createNextOfKin = (data) => API.post('/kin', data);
export const updateNextOfKin = (id, data) => API.put(`/kin/${id}`, data);
export const deleteNextOfKin = (id) => API.delete(`/kin/${id}`);

// ======================== PLACES ========================
export const getPlaces = () => API.get('/places');
export const getPlaceById = (id) => API.get(`/places/${id}`);
export const createPlace = (data) => API.post('/places', data);
export const updatePlace = (id, data) => API.put(`/places/${id}`, data);
export const deletePlace = (id) => API.delete(`/places/${id}`);

// ======================== REPORTS (a–n) ========================
export const getReportA = () => API.get('/reports/hall-managers');
export const getReportB = () => API.get('/reports/students-leases');
export const getReportC = () => API.get('/reports/summer-leases');
export const getReportD = (studentId) => API.get(`/reports/student-rent/${studentId}`);
export const getReportE = (dueDate) => API.get(`/reports/unpaid-invoices?date=${dueDate}`);
export const getReportF = () => API.get('/reports/unsatisfactory-inspections');
export const getReportG = (hallId) => API.get(`/reports/hall-students/${hallId}`);
export const getReportH = () => API.get('/reports/waiting-list');
export const getReportI = () => API.get('/reports/student-category-count');
export const getReportJ = () => API.get('/reports/students-without-kin');
export const getReportK = (studentId) => API.get(`/reports/student-adviser/${studentId}`);
export const getReportL = () => API.get('/reports/hall-rent-stats');
export const getReportM = () => API.get('/reports/hall-place-count');
export const getReportN = () => API.get('/reports/senior-staff');

// ======================== RAW QUERY (Reports) ========================
export const executeQuery = (query) => API.post('/query', { query });

export default API;
