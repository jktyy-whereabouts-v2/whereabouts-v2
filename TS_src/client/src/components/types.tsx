export interface User {
  name: string;
  phone_number: string;
  password: string;
}

export interface Props {
  userInfo: User;
  setUserInfo: React.Dispatch<React.SetStateAction<User>>;
}
