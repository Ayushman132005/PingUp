import axios from 'axios';
import React, { useContext,createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpStatus from "http-status";

export const AuthContext = createContext({});
const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/users",
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const router = useNavigate();
   
  const handleRegister = async (name, username, password) => {
    console.log("reach")
    try {
      console.log("Sending register request to:", client.defaults.baseURL + '/register');
      let request = await client.post('/register', { name:name, username:username, password:password });  // ye fail kar raha hai
      console.log("Response:", request);
      if(request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      console.error("Register error details:", err.response || err.message || err);
      throw err;
    } 
  };

  const handleLogin = async (username, password) => {
    try{
      let request = await client.post('/login', { username:username, password:password });
      if(request.status === httpStatus.OK) {
        localStorage.setItem('token', request.data.token);
      }
    }
    catch (err) {
      throw err;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  }
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
}