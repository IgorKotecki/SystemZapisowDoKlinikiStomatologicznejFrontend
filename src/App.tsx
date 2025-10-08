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

import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['Registered_user', 'Doctor']}>
                  <User />
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
