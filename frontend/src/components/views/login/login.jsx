import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import FontAwesome icons

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './login.css';

function Login() {
	const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Print username and password to the console
        console.log('Username:', formData.username);
        console.log('Password:', formData.password);
        setFormData({username: '', password: ''})
        // Add your login logic here
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="section-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className='label-title'>Username</label>
                        <input
                            className="text-input"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='label-title'>Password</label>
                        <div>
                        <input
                            className="text-input"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="password-toggle" onClick={handleTogglePassword}>
                            {showPassword ? 'Hide' : 'Show'} Password
                        </span>
                        </div>
                    </div>
                    <button className='login-btn' type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;