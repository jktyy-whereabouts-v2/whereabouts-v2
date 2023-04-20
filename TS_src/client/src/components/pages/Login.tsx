import React, { useState } from "react";
import axios from "axios";
import { Navigate, redirect, Link, Routes, Route } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { User, UserProps } from "../types";

function Login({ userInfo, setUserInfo }: UserProps) {
  // hook to redirect after successful login
  const [redirect, setRedirect] = useState<boolean>(false);

  // handles input updates in input forms
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const userLogin = {
      phone_number: userInfo.phone_number,
      password: userInfo.password,
    };

    //console.log(`userLogin: ${JSON.stringify(userLogin)}`);

    // Send post request to BE. Must verify user. Looking for 200 status in order to proceed

    axios
      .post("/api/login/", userLogin)
      .then((response) => {
        // checking response from server
        console.log(`this is response: ${JSON.stringify(response)}`);
        if (response.status === 200) {
          // console.log(`response: ${response.json()}`);
          setRedirect(true);
          setUserInfo(() => {
            return {
              name: response.data.name,
              phone_number: response.data.phone_number,
            };
          });
        }
      })
      .catch((error) => {
        if (error) {
          alert(`Please check login information and try again`);
        }
      });
  };

  return (
    <div className="login-container">
      {/* Invoking redirect hook in event of successful login */}
      {redirect && <Navigate to="/dashboard" replace={true} />}
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
            onChange={onChange}
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
            onChange={onChange}
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
