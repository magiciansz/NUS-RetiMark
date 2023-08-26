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
        </div>
      <div className='tabs'>
        <div className='tab'>Predictor</div>
        <div className='tab'>Past reports</div>
      </div>
      <div className="logout">Logout</div>
    </div>
  )
}

export default Navi