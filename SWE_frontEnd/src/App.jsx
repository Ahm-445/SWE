import Home from "./Pages/Home"
import Navbar from "./Pages/Navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from "./Pages/Register";
import Login from "./Pages/login";
import News from "./Pages/News";

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden dir-rtl">
      

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar/><Home /></>} />
        <Route path="/register" element={<><Navbar/><Register /></>} />
        <Route path="/login" element={<><Navbar/><Login /></>} />
        <Route path="/news" element={<><Navbar/><News /></>} />

      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
