import React, { useState } from "react";
import styles from "./Login.module.css";
import googleLogo from "../assets/Google.png";
import appleLogo from "../assets/apple.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit =  async(evt) => {
    evt.preventDefault();


    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", data);
      const { access_token } = response.data;

      document.cookie = `access_token=${access_token}; path=/; ${
        rememberMe ? "" : "max-age=3600;"
      } SameSite=Strict; secure`;
      setIsAuthenticated(true);
      navigate("/dashboard");

    } catch (error) {
      console.error("An error occurred during login:", error);
      alert("An error occurred during login.");
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.welcome_msg}>
        <h1>Welcome Back .!</h1>
        <div className={styles.flex_btn}>
          <button className={styles.btn_useless}>Skip the lag ?</button>
        </div>
      </div>
      <div className={styles.login_form}>
        <div className={styles.form_content}>
          <h2>Login</h2>
          <p>Glad you're back .!</p>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.remember_me}>
            <input
              type="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
             
            />
            <label>Remember me</label>
          </div>
          <button onClick={handleSubmit} >
            Login
          </button>
          <p>Forgot password?</p>
          <div className={styles.or}>
            <p>Or</p>
          </div>
          <div className={styles.social_login}>
            <button >
              <img src={googleLogo} alt="Google" />
            </button>
            <button className={styles.apple_logo} >
              <img src={appleLogo} alt="Apple" />
            </button>
          </div>
          <p>
            Don't have an account? <a href="/signup">Signup</a>
          </p>
          <p>
            <a href="#">Terms & Conditions | </a>
            <a href="#">Support | </a>
            <a href="#">Customer Care</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
