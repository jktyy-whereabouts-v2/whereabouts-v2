import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { User, UserProps } from "../types";

const LOGIN_URL = "/api/login";

function Login({ userInfo, setUserInfo }: UserProps) {
  const navigate = useNavigate();

  // hook to redirect after successful login
  const [redirect, setRedirect] = useState<boolean>(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify(userInfo),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data) {
        setRedirect(true);
      }
    } catch (error) {
      console.log(error);
      alert(`Please check login information and try again`);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/dashboard");
    }
  });

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-container">
        <br></br>
        <h3>Already a member?</h3>
        <h3>Please Login</h3>
        <br></br>
        <div className="input-container">
          <br></br>
          <TextField
            type="text"
            className="input-box"
            id="phone_number"
            name="phone_number"
            label="login phone number"
            size="small"
            required={true}
            value={userInfo.phone_number}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone_number: e.target.value })
            }
          />
        </div>
        <div className="input-container">
          <br></br>
          <TextField
            type="password"
            id="password"
            className="input-box"
            name="password"
            label="password"
            size="small"
            required={true}
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
        </div>
        <br></br>
        <Button type="submit" className="submit-btn" variant="contained">
          Submit Login
        </Button>
        <br></br>
      </form>

      <p>
        Don't have a login yet?
        <Link to="/register"> Sign up here!</Link>
      </p>
    </div>
  );
}

export default Login;
