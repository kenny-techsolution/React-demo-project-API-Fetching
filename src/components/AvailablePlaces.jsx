import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { useState, useEffect } from "react";
import { fetchAvailablePlaces } from "../http.js";
import { sortPlacesByDistance } from "../loc.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const sortedPlaces = sortPlacesByDistance(places, lat, long);
          setIsFetching(false);
          setAvailablePlaces(sortedPlaces);
        });
      } catch (error) {
        setError({
          message:
            error.message || "couldn't fetch places, please try again later",
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText="Fetching place data..."
      isLoading={isFetching}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
