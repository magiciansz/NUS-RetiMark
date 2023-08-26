// import Navbar from "./components/Navbar"
// import './app.css'
// import Home from "./pages/Home"
// import Home from "./pages/Home"
import Home from './components/views/home/home';
import Navi from './components/navi/navi';

// import Register from "./pages/Register"
// import Wishes from "./pages/Wishes"
// import Add from "./pages/Add"
// import Update from "./pages/Update"
// import SingleWish from "./pages/SingleWish"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => { 
      
    return (
        <BrowserRouter>
            <div> 
                <Routes>
                    <Route path="/" element={<><Navi/><Home/></>}/>
                    {/* <Route path="/register" element={<Register/>}/>
                    <Route path = "/home" element = {<><Navbar/><Home/></>} />
                    <Route path="/wishes" element={<><Navbar/><Wishes/></>}/>
                    <Route path="/add" element={<><Navbar/><Add/></>}/>
                    <Route path="/update/:id" element={<><Navbar/><Update/></>}/>
                    <Route path="/singlewish/:id" element={<><Navbar/><SingleWish/></>}/> */}
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App;