import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import FontAwesome icons
import Cookies from "js-cookie";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useNavigate,
} from "react-router-dom";
import AuthApi from "../../../apis/AuthApi";

import "./login.css";

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
    // Print username and password to the console
    setErrorMessage("");
    console.log("Username:", formData.username);
    console.log("Password:", formData.password);
    setFormData({ username: "", password: "" });
    // Add your login logic here
    await login();
  };

  const login = useCallback(async () => {
    console.log("running login");
    const requestParams = {
      username: formData.username,
      password: formData.password,
    };
    try {
      console.log("trying to login");
      const res = await AuthApi.login(requestParams);
      console.log("res from login", res.data.tokens);
      const { accessToken, refreshToken } = res.data.tokens;
      // Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
      // Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict', httpOnly: true });

      // Save the access token and its expiry time to cookies
      Cookies.set("accessToken", JSON.stringify(accessToken), {
        secure: true,
        sameSite: "None",
        expires: new Date(accessToken.expiry), // Convert expiry time to a Date object
      });

      Cookies.set("refreshToken", JSON.stringify(refreshToken), {
        secure: true,
        sameSite: "None",
        expires: new Date(refreshToken.expiry), // Convert expiry time to a Date object
      });
      navigate("/");

      // kiv the httpOnly true below. it doesnt save it in cookies
      // Cookies.set('refreshToken', refreshToken, {
      //     secure: true,
      //     sameSite: 'strict',
      //     // httpOnly: true,
      //     expires: new Date(refreshToken.expiry), // Convert expiry time to a Date object
      // });
    } catch (err) {
      console.error(err);
      setErrorMessage("Wrong username or password");
    }
  }, [formData]);

  // useEffect(() => {
  //     login();
  //   }, [login]);

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
