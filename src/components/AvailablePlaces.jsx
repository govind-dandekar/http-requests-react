import { useState, useEffect } from 'react';

import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // can use Fetch to send data too
  // updated to async await: can create async fx in uE
  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);
      const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();
      setAvailablePlaces(resData.places);
      setIsFetching(false);
    }

    fetchPlaces();
  },[])

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
