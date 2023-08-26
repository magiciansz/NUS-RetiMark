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

      Past reports
      Logout
    </div>
  )
}

export default Navi