import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import React, { useState } from "react";

// hard code API key. Keep safe
const key = "AIzaSyBRzoiY1lCeVlXPEZELkqEdTehWIUcijms";

const containerStyle = {
  height: "300px",
  width: "700px",
};

function MapComponent({ trip }: any) {
  const { isLoaded } = useJsApiLoader({
    id: import.meta.env.VITE_GOOGLEMAPID,
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAPAPIKEY,
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
