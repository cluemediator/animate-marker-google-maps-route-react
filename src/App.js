import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import GMap from './GMap';

// API key of the google map
const GOOGLE_MAP_API_KEY = '<YOUR_GOOGLE_MAP_API_KEY>';

const App = () => {
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const options = {
      apiKey: GOOGLE_MAP_API_KEY,
      version: "weekly",
      libraries: ['geometry']
    };

    new Loader(options).load().then(() => {
      setLoadMap(true);
    }).catch(e => {
      console.error('Sorry, something went wrong: Please try again later. Error:', e);
    });
  }, []);

  return (
    <div className="App">
      <h4>Animate marker on Google Maps route in React - <a href="https://www.cluemediator.com">Clue Mediator</a></h4>
      {!loadMap ? <div>Loading...</div> : <GMap />}
      <br />
      <small><b>Note:</b> In order to make it work, you have to set the YOUR_GOOGLE_MAP_API_KEY in App.js file. </small>
    </div>
  );
}

export default App;
