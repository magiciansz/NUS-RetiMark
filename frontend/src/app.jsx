import Home from './components/views/home/home';
import Navi from './components/navi/navi';
import PastReports from './components/views/pastreports/pastreports';
import Login from './components/views/login/login';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => { 
      
    return (
        <BrowserRouter>
            <div> 
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<><Navi/><Home/></>}/>
                    <Route path="/reports" element={<><Navi/><PastReports/></>}/>
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