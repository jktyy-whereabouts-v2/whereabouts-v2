import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import React, { useState } from "react";


const containerStyle = {
  height: "300px",
  width: "700px",
};

function MapComponent({ trip }: any) {
  const { isLoaded } = useJsApiLoader({
    id: '6dd1b6720588ad3a',
    googleMapsApiKey: 'AIzaSyA4GiNhPzyhXS98_ziVHrQLimw8VILXUuk',
  });

  const center = {
    lat: trip.start_lat,
    lng: trip.start_lng,
  };

  const [map, setMap] = useState(null);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onUnmount={onUnmount}
    >
      <Marker position={center}></Marker>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default MapComponent;
