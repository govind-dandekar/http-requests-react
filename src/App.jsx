import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces, fetchUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // fetch stored user selected places when the App initially loads
  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        setError({message: error.message || 'Unable to retreive selected places'})
      }
      setIsFetching(false);
    }
    
    fetchPlaces()
  }, [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      // send updated array of selected places to backend to 
      // store as user-places; state will not be updated until
      // component renders again, so use old state and
      // add selected place for PUT fx
      // not managing loading state but using "optimistic" update
      // updating state locally (which updates UI) prior to
      // HTTP PUT call via fetch()
      // if await fx called prior to setUserPlaces state update, then
      // should manage loading state and UI accordinly due
      // to possible latency of HTTP PUT
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      // if error, reset to old user places since PUT call
      // failed; rollback change and re-update UI
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({message: error.message || 'Failed to update places'})
      
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      // add logic to remove picked place here from backend data
      await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id ))
    } catch (error) {
      //rollback userPlaces if updateUserPlaces throws an error
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({message: error.message || 'Failed to delete place'})
    }

    setModalIsOpen(false);
  }, []);

  function handleError(){
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && <ErrorPage 
          title="An error occured!"
          message={errorUpdatingPlaces.message}
          onConfirm={handleError}
        />}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage title="An error occured" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isFetching}
          loadingText="Fetching your places..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
