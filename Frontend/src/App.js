import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login/Login";
import Signup from "./SignUp/Signup";
import UploadForm from "./uploads/upload";
import axios from "axios";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Handle authenticated state
  const [loading, setLoading] = useState(true); // Loading state while checking authentication
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const token = getCookie("access_token");
  useEffect(() => {

    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token verification failed", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while verifying the token
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated = {setIsAuthenticated}/>} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <LandingPage />  : <Navigate to="/login" />} 
        />
        <Route 
          path="/upload" 
          element={<UploadForm />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
