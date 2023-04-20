import React from "react";
import Login from "./Login";
import { Link } from "react-router-dom";
import { User } from "../types";
// interface userInfoType {
//   name: string;
//   phone_number: string;
//   password: string;
// }

// interface StartPageProps {
//   userInfo: userInfoType;
// }

// type SetPropsType {
// 	setFunction: React.Dispatch<React.SetStateAction<User>>
// }

interface Props {
  userInfo: User;
  setUserInfo: React.Dispatch<React.SetStateAction<User>>;
}

// const StartPage = ({ userInfo }: Props) => {
//   return <div>StartPage</div>;
// };

function StartPage({ userInfo, setUserInfo }: Props) {
  return (
    <>
      <div className="startpage-cont">
        <Login userInfo={userInfo} setUserInfo={setUserInfo} />
      </div>
    </>
  );
}

export default StartPage;
