import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";


const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Router>
        <Header />
        <main style={{ flex: 1, display: 'flex' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<LogIn />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/LogIn" element={<LogIn/>}/>
            <Route path="/register" element={<Register/>}/>
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};


export default App
