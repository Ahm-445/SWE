import Home from "./Pages/Home"
import Navbar from "./Pages/Navbar"
import GPA from "./Pages/GPA"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import News from "./Pages/News";
import Evaluation from "./Pages/Evaluation";
import Absence from "./Pages/Absence";
import Table from "./Pages/table";
import Contacts from "./Pages/Contacts";
import NotFound404 from "./Pages/NotFound404";
import Student from "./Pages/Student";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";

import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";

function AnimatedRoutes() {
  const location = useLocation(); 

  return (
    <div key={location.pathname} className="page-animate flex-1">
      <Navbar />
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/student" element={<Student />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gpa" element={<GPA />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/absence" element={<Absence />} />
            <Route path="/schedule" element={<Table />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound404 />} />
        </Routes>
    </div>
  );
}
  

function App() {
  return (
    <div className="flex flex-col h-screen overflow-auto dir-rtl">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
