import Home from "./Pages/Home"
import Navbar from "./Pages/Navbar"
import GPA from "./Pages/GPA"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import News from "./Pages/News";
import Evaluation from "./Pages/Evaluation";
import Absence from "./Pages/Absence";
import Table from "./Pages/table";
import NotFound404 from "./Pages/NotFound404";


function App() {
  return (
    <div className="flex flex-col h-screen overflow-auto dir-rtl">
      

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar/><Home /></>} />
        <Route path="/news" element={<><Navbar/><News /></>} />
        <Route path="/gpa" element={<><Navbar/><GPA /></>} />
        <Route path="/evaluation" element={<><Navbar/><Evaluation /></>} />
        <Route path="/absence" element={<><Navbar/><Absence /></>} />
        <Route path="/schedule" element={<><Navbar/><Table /></>} />
        <Route path="*" element={<><Navbar/><NotFound404 /></>} />
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
