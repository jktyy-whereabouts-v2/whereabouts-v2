import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

const containerStyle = {
	height: '300px',
	width: '700px',
};

function ContactsMapContainer({ userTrip }: any) {
	const { isLoaded } = useJsApiLoader({
		id: process.env.GOOGLEMAPSID,
		googleMapsApiKey: process.env.GOOGLEMAPSAPIKEY,
	});

	const center = {
		lat: Number(userTrip.start_lat),
		lng: Number(userTrip.start_lng),
	};

	const [map, setMap] = useState(null);

	const onUnmount = React.useCallback(function callback(map: any) {
		setMap(null);
	}, []);

	return isLoaded ? (
		<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onUnmount={onUnmount}>
			<Marker position={center}></Marker>
		</GoogleMap>
	) : (
		<></>
	);
}

export default ContactsMapContainer;
