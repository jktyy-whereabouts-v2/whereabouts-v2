import React from 'react';
import Login from './Login';
import { Link } from 'react-router-dom';
import { User, UserProps } from '../types';
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

// const StartPage = ({ userInfo }: Props) => {
//   return <div>StartPage</div>;
// };

interface StartPageProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	login: Function;
}

function StartPage({ userInfo, setUserInfo, login }: StartPageProps) {
	return (
		<>
			<div className="startpage-cont">
				<Login userInfo={userInfo} setUserInfo={setUserInfo} login={login} />
			</div>
		</>
	);
}

export default StartPage;
