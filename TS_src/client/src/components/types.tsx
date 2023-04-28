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
	id: string;
	sos_lat: string;
	sos_lng: string;
	sos_timestamp: string;
	start_timestamp: string;
	end_timestamp: string;
	start_lat: string;
	start_lng: string;
	trips_id: any;
	user_is_traveler: any;
	user_phone_number: any;
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