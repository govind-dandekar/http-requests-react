export async function fetchAvailablePlaces(){
	const response = await fetch('http://localhost:3000/places');
	const resData = await response.json();
	// 200, 300 vs 400, 500
	if (!response.ok) {
		throw new Error('Failed to fetch places');
	}

	return resData.places;
}

export async function updateUserPlaces(places){
	const response = await fetch('http://localhost:3000/user-places', {
		method: 'PUT',
		// define data passed as body in attachable format
		body: JSON.stringify({places: places}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const resData = await response.json();

	if (!response.ok) {
		throw new Error('Failed to update user data');
	}

	return resData.message;
}