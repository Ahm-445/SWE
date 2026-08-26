import Home from "./Pages/Home"
import Navbar from "./Pages/Navbar"
import GPA from "./Pages/GPA"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import News from "./Pages/News";
import Evaluation from "./Pages/Evaluation";

function App() {
  return (
    <div className="flex flex-col h-screen overflow-auto dir-rtl">
      

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar/><Home /></>} />
        <Route path="/news" element={<><Navbar/><News /></>} />
        <Route path="/gpa" element={<><Navbar/><GPA /></>} />
        <Route path="/evaluation" element={<><Navbar/><Evaluation /></>} />
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
