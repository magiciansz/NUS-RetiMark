import { Link, useNavigate } from 'react-router-dom'
import './navi.css';

const Navi = () => {
  return (
    <div className="navi">
        <div className="logo-container">
            <img
                src="http://retimark.com/layout/images/common/logo.png" // Your external image URL
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
                <div className='tab'>Logout</div>
            </Link>
        </div>
        
        {/* <div className="logout">Logout</div> */}
    </div>
  )
}

export default Navi