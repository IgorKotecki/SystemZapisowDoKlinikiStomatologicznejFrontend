import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import Team from "./pages/Team";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Prices";
import Contact from "./pages/Contact";
import User from "./pages/userPages/userProfile";
import Appointments from "./pages/userPages/userAppointments";
import UserMakeAppointment from "./pages/userPages/userMakeAppointment";
import DentalChartPage from "./pages/userPages/DentalChartPage";
import ReceptionistProfile from "./pages/receptionist/receptionistProfile";
import ReceptionistCalendar from "./pages/receptionist/receptionistAppointments";
import ReceptionistUsers from "./pages/receptionist/receptionistUsers";
import EditUser from "./pages/receptionist/receptionistUserInfo";
import ReceptionistAppointment from "./pages/receptionist/receptionistMakeAppointment";
import ReceptionistServices from "./pages/receptionist/receptionistServices";
import EditService from "./pages/receptionist/receptionistServiceInfo";
import DoctorProfile from "./pages/doctor/doctorProfile";
import DoctorAppointments from "./pages/doctor/doctorAppointments";
import DoctorCalendar from "./pages/doctor/doctorCalendar";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorDaySchedule from "./pages/doctor/doctorDaySchedule";

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/team" element={<Team />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/prices" element={<Pricing />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            
            {/* USER */}

            <Route
              path="/user/profile"
              element={
                <ProtectedRoute allowedRoles={['Registered_user']}>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/appointments"
              element={
                <ProtectedRoute allowedRoles={['Registered_user']}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/makeAppointment"
              element={
                <ProtectedRoute allowedRoles={['Registered_user']}>
                  <UserMakeAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dental"
              element={
                <ProtectedRoute allowedRoles={['Registered_user']}>
                  <DentalChartPage />
                </ProtectedRoute>
              }
            />

            {/* RECETIONIST */}
            
            <Route
              path="/receptionist/profile"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <ReceptionistProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/calendar"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <ReceptionistCalendar />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/receptionist/users"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <ReceptionistUsers />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/receptionist/users/:id"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/appointment"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <ReceptionistAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/services"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <ReceptionistServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/services/:id"
              element={
                <ProtectedRoute allowedRoles={["Receptionist"]}>
                  <EditService />
                </ProtectedRoute>
              }
            />

            {/* DOCTOR */}
            
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/users"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <ReceptionistUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/users/:id"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointment"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/calendar"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DoctorCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/daySchedule"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DoctorDaySchedule />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App
