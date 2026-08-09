import Home from "./Pages/Home"
import Navbar from "./Pages/Navbar"
import GPA from "./Pages/GPA"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import News from "./Pages/News";

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden dir-rtl">
      

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar/><Home /></>} />
        <Route path="/news" element={<><Navbar/><News /></>} />
        <Route path="/gpa" element={<><Navbar/><GPA /></>} />
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
