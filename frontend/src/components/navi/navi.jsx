import { Link } from 'react-router-dom'
import './navi.css';
import Cookies from 'js-cookie';

import Logo from '../../css/imgs/retimark-logo.png';

// Component: Navigation bar 
const Navi = () => {
    const clearCookies = () => {
        Cookies.remove('accessToken'); // Clear the access token cookie
        Cookies.remove('refreshToken'); // Clear the refresh token cookie
    };

    return (
        <div className="navi">
            <div className="logo-container">
                <img
                    src={Logo}
                    alt="Logo"
                    className="logo"
                />
                <div className='left-tabs'>
                    <Link to="/">
                        <div className='tab'>Predictor</div>
                    </Link>
                    <Link to='/reports'>
                        <div className='tab'>Past reports</div>
                    </Link>
                </div>
            </div>
            <div className='login-tab'>
                <Link to='/login'>
                    <div className='tab' onClick={clearCookies}>Logout</div>
                </Link>
            </div>
        </div>
    )
}

export default Navi