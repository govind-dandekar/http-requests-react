import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js'

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
       
        // returns promise that resolves to places or error
        const places = await fetchAvailablePlaces()

        // can't use async await because getCurrentPosition
        // doesn't yield a promise
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          // must setIsFetching include in callback fx 
          // so it doesn't get executed early
          setIsFetching(false);
        });
      } catch (error) {
         setError({message: 
          (error.message || 'Could not fetch places, please try again later')
        });
        setIsFetching(false);
      }
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
