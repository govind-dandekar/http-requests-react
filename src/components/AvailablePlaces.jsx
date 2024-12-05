import { useState, useEffect } from 'react';

import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // can use Fetch to send data too
  // updated to async await: can create async fx in uE
  useEffect(() => {
    async function fetchPlaces(){
      const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();
      setAvailablePlaces(resData)
    }
  },[])
  
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
