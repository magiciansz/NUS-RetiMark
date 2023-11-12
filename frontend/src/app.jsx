import Home from './components/views/home/home';
import Navi from './components/navi/navi';
import PastReports from './components/views/pastreports/pastreports';
import Login from './components/views/login/login';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthRoute from './components/auth/AuthRoute';


const App = () => {       
    return (
        <BrowserRouter>
            <div> 
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route element={<AuthRoute/>}>
                        <Route path="/" element={<><Navi/><Home/></>}/>    
                        <Route path="/reports" element={<><Navi/><PastReports/></>}/>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App;