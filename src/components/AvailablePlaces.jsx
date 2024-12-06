import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  
  // data, loadind, and error is common state pattern
  // for async HTTP requests
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  // can use Fetch to send data too
  // updated to async await: can create async fx in uE
  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:3000/places');
        const resData = await response.json();
        // 200, 300 vs 400, 500
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
         setError({message: 
          (error.message || 'Could not fetch places, please try again later')
        })
      }
      setIsFetching(false);
    }

    fetchPlaces();
  },[])

  if (error) {
    return (
      <ErrorPage 
        title="An error occured"
        message={error.message}
      />
    )
  }

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
