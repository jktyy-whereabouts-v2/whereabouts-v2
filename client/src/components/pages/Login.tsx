import React from "react";

type User = {
  name: string;
  phone_number: string;
  password: string;
};
interface Props {
  userInfo: User;
  setUserInfo: React.Dispatch<React.SetStateAction<User>>;
}

function Login() {
  return <div>Login</div>;
}

export default Login;
