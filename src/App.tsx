import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import './i18n';
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
import { GlobalAlert } from "./utils/GlobalAlert";
import ProtectedRoute from "./components/ProtectedRoute";
import UserAppointmentsHistory from "./pages/receptionist/userAppointemntsHistoty";

const Home = lazy(() => import("./pages/Home"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Register = lazy(() => import("./pages/Register"));
const Appointment = lazy(() => import("./pages/Appointment"));
const ConfirmPage = lazy(() => import("./pages/ConfirmPage"));
const Team = lazy(() => import("./pages/Team"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Prices"));
const Contact = lazy(() => import("./pages/Contact"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const RegisterGratulation = lazy(() => import("./pages/RegisterGratulation"));

const User = lazy(() => import("./pages/userPages/userProfile"));
const Appointments = lazy(() => import("./pages/userPages/userAppointments"));
const UserMakeAppointment = lazy(() => import("./pages/userPages/userMakeAppointment"));
const DentalChartPage = lazy(() => import("./pages/userPages/DentalChartPage"));

const ReceptionistProfile = lazy(() => import("./pages/receptionist/receptionistProfile"));
const ReceptionistCalendar = lazy(() => import("./pages/receptionist/receptionistCalendar"));
const ReceptionistUsers = lazy(() => import("./pages/receptionist/receptionistUsers"));
const ReceptionistAppointment = lazy(() => import("./pages/receptionist/receptionistMakeAppointment"));
const ReceptionistServices = lazy(() => import("./pages/receptionist/receptionistServices"));
const EditService = lazy(() => import("./pages/receptionist/receptionistServiceInfo"));

const DoctorProfile = lazy(() => import("./pages/doctor/doctorProfile"));
const DoctorAppointments = lazy(() => import("./pages/doctor/doctorAppointments"));
const DoctorCalendar = lazy(() => import("./pages/doctor/doctorCalendar"));
const DoctorDaySchedule = lazy(() => import("./pages/doctor/doctorDaySchedule"));
const DoctorAppointmentsConsole = lazy(() => import("./pages/doctor/doctorAppointmentConsole"));
const AdditionalInformation = lazy(() => import("./pages/doctor/doctorAddInfo"));

const App = () => {
  return (
    <>
      <GlobalAlert />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1}}>
            <Suspense fallback={<div>Loading...</div>}>
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
                <Route path="/register/gratulation" element={<RegisterGratulation />} />
                <Route path="/confirm" element={<ConfirmPage />} />

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
                <Route
                  path="/receptionist/users"
                  element={
                    <ProtectedRoute allowedRoles={["Receptionist"]}>
                      <ReceptionistUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receptionist/appointment"
                  element={
                    <ProtectedRoute allowedRoles={["Receptionist", "Doctor"]}>
                      <ReceptionistAppointment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receptionist/services"
                  element={
                    <ProtectedRoute allowedRoles={["Receptionist", "Doctor"]}>
                      <ReceptionistServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receptionist/services/:id"
                  element={
                    <ProtectedRoute allowedRoles={["Receptionist", "Doctor"]}>
                      <EditService />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receptionist/userAppointments"
                  element={
                    <ProtectedRoute allowedRoles={["Receptionist", "Doctor"]}>
                      <UserAppointmentsHistory />
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
                <Route
                  path="/doctor/appointmentConsole/:guid"
                  element={
                    <ProtectedRoute allowedRoles={["Doctor"]}>
                      <DoctorAppointmentsConsole />
                    </ProtectedRoute>
                  }
                />
                <Route path="/doctor/additionalInfo"
                  element={
                    <ProtectedRoute allowedRoles={["Doctor"]}>
                      <AdditionalInformation />
                    </ProtectedRoute>} />

              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App
