import { useState, useEffect } from 'react';

import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // can use Fetch to send data too
  // fetch returns a Promise which will resolve to a value 
  // (eventually receive response object in this case)
  // wrap in useEffect to avoid inf loop
  useEffect(() => {
    fetch('http://localhost:3000/places').then((response) => {
      // .json extracts json data in response
      return response.json()
    }).then((responseData) => {
      // would create inf loop since Component will re-execute
      // on state update
      setAvailablePlaces(responseData.places)
    })  
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
