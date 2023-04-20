import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { User, UserProps } from "../types";

function Registration({ userInfo, setUserInfo }: UserProps) {
  interface StatusProps {
    sent: boolean;
    message: string;
  }

  const [passMatch, setPassMatch] = useState<boolean>(true);
  const [subStatus, setSubStatus] = useState<StatusProps>({
    sent: false,
    message: "",
  });

  // conditional alert
  const mismatchAlert = passMatch ? "" : "Passwords do not match";
  //const subFailedAlert = subStatus ? '' : 'Submission failed. Please try again.';
  const subFailedAlert = !subStatus.sent ? "" : subStatus.message;

  // hook to redirect after successful registration
  const [redirect, setRedirect] = useState(false);

  // updates state as user inputs form info
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };
  // confirms first password entry & second password entry match
  const confirmMatch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === userInfo.password) {
      setPassMatch(true);
      console.log("passwords match");
    } else {
      setPassMatch(false);
      console.log("passwords do not match");
    }
  };
  /*
      Sends user data to backend, redirects to contacts page if successful.
      If not, alerts user of failure.
    */
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log("submitting user data");
    if (!passMatch) {
      setSubStatus((prevState) => {
        return {
          ...prevState,
          status: false,
          message: "Passwords do not match. Please correct before submitting",
        };
      });
      return;
    }
    try {
      // post request with new user data to backend, redirect to dashboard upon completion
      // console.log("userInfo being sent to BE =>", userInfo);
      const response = await axios.post("/api/register", userInfo);
      // console.log("response from POST req =>", response);
      if (response.status === 200) {
        setSubStatus((prevState) => {
          return {
            ...prevState,
            sent: true,
            message: "Your account has been created",
          };
        });
        console.log("User added to DB");
        setRedirect(true);
      } else {
        throw new Error();
      }
    } catch (err) {
      // render user alert that submission failed
      console.log("this is the error =>", err.response.data.error);
      setSubStatus((prevState) => {
        return {
          ...prevState,
          sent: true,
          message: err.response.data.error,
        };
      });
    }
  };
  return (
    <div className="registration-container">
      <br></br>
      {/* Invoking redirect hook in event of successful login */}
      {redirect && <Navigate to="/dashboard" replace={true} />}
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="registration-input-container">
          <br></br>
          <h3>Sign Up</h3>
          <br></br>
          <TextField
            label="full name"
            type="text"
            className="input-box"
            name="name"
            id="name"
            size="small"
            helperText="enter your first and last name"
            required={true}
            onChange={onChange}
          />
        </div>
        <br></br>
        <div className="registration-input-container">
          <TextField
            label="phone number"
            type="text"
            className="input-box"
            name="phone_number"
            id="phone"
            size="small"
            required={true}
            onChange={onChange}
          />
        </div>
        <br></br>
        <div className="registration-input-container">
          <TextField
            label="password"
            type="password"
            className="input-box"
            name="password"
            id="password"
            size="small"
            required={true}
            onChange={onChange}
          />
        </div>
        <br></br>
        <div className="registration-input-container">
          <TextField
            label="confirm password"
            type="password"
            className="input-box"
            name="password"
            id="confirm-password"
            size="small"
            required={true}
            onChange={confirmMatch}
          />
          <p>{mismatchAlert}</p>
        </div>
        <br></br>
        <Button type="submit" className="styleMe" variant="contained">
          Create Your Account
        </Button>
        <br></br>
        <Button type="submit" className="styleMe" variant="text">
          Already Have an Account? Sign In
        </Button>
        <br></br>
      </form>
      <br></br>
      <p>{subStatus.message}</p>
    </div>
  );
}

export default Registration;
