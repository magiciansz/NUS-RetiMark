import React, { useState, useCallback} from "react";
import Cookies from "js-cookie";

import {
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import AuthApi from "../../../apis/AuthApi";

import "./login.css";

// Component: Login page
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFormData({ username: "", password: "" });
    await login();
  };

  const login = useCallback(async () => {
    const requestParams = {
      username: formData.username,
      password: formData.password,
    };
    try {
      const res = await AuthApi.login(requestParams);
      const { accessToken, refreshToken } = res.data.tokens;

      // Save both access and refresh tokens and their  expiry time to cookies
      Cookies.set("accessToken", JSON.stringify(accessToken), {
        secure: true,
        sameSite: "None",
        expires: new Date(accessToken.expiry), 
      });

      Cookies.set("refreshToken", JSON.stringify(refreshToken), {
        secure: true,
        sameSite: "None",
        expires: new Date(refreshToken.expiry), 
      });

      // Navigate to home page if user successfully logs in
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("Wrong username or password");
    }
  }, [formData]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="section-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label-title">Username</label>
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
            <label className="label-title">Password</label>
            <div>
              <input
                className="text-input"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span className="password-toggle" onClick={handleTogglePassword}>
                {showPassword ? "Hide" : "Show"} Password
              </span>
            </div>
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Login;
