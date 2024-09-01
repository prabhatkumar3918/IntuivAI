import React, { useState } from "react";
import styles from "./Signup.module.css";
import googleLogo from "../assets/Google.png";
import appleLogo from "../assets/apple.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!validateForm()) return;

    const data = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/signup", data);
      const { access_token } = response.data;

      // Set the access token in a cookie
      document.cookie = `access_token=${access_token}; path=/; ${
        rememberMe ? "" : "max-age=3600;"
      } SameSite=Strict; secure`;
      setIsAuthenticated(true);
      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("An error occurred during signup:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcome_msg}>
        <h1>Roll the Carpet .!</h1>
        <div className={styles.flex_btn}>
          <button className={styles.btn_useless}>Skip the lag ?</button>
        </div>
      </div>
      <div className={styles.login_form}>
        <div className={styles.form_content}>
          <h2>SIGNUP</h2>
          <p>Just Some details to get you in .!</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm-Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className={styles.remember_me}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label>Remember me</label>
          </div>
          <button onClick={handleSubmit}>Signup</button>
          <p>Forgot password?</p>
          <div className={styles.or}>
            <p>Or</p>
          </div>
          <div className={styles.social_login}>
            <button>
              <img src={googleLogo} alt="Google" />
            </button>
            <button className={styles.apple_logo}>
              <img src={appleLogo} alt="Apple" />
            </button>
          </div>
          <p>
            Already have an account? <a href="/login">Login</a>
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

export default Signup;
