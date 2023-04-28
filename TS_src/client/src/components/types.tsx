export interface User {
	name: string;
	phone_number: string;
	password: string;
}

export interface UserProps {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
}

export interface Trip {
	active: boolean;
	start_timestamp: string;
	start_lat: string;
	start_lng: string;
	sos_timestamp: string;
	sos_lat: string;
	sos_lng: string;
}

export interface TripProps {
	userTrip: Trip;
	setUserTrip: React.Dispatch<React.SetStateAction<Trip>>;
}

export type Nullable<T> = T | null;

export interface Conversation {
  id: number;
  member1: string;
  member2: string;
}

export interface Message {
  senderPhone: string;
  text: string;
  receiverPhone: string;
  convId: number;
}