export interface User {
	name: string;
	phone_number: string;
	password: string;
}

export interface UserProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
}
