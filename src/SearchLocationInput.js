import React, { useState, useEffect, useRef } from "react";


let autoComplete;
const key = ""

function SearchLocationInput() {
    const [query, setQuery] = useState("");
    const autoCompleteRef = useRef(null);
    const [address, setAddress] = useState("")
    const [latitude, setLatitude] = useState()
    const [longtitude, setLongtitude] = useState()
    const [photoUrl, setPhotoUrl] = useState()
  
    useEffect(() => {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`,
        () => handleScriptLoad(setQuery, autoCompleteRef)
      );
    }, []);

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["establishment"], componentRestrictions: { country: "uk" } }
  );
  
  autoComplete.setFields(["address_components", "formatted_address", "geometry", "photos"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  setAddress(addressObject.formatted_address);
  console.log(autoComplete.getPlace())
  console.log(addressObject.formatted_address);
  setLatitude(addressObject.geometry.location.lat)
  setLongtitude(addressObject.geometry.location.lng)
  setPhotoUrl(addressObject.photos[0].getUrl())
}

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter a Hotel"
        value={query}
      />
      <br/>
      <div class="info">Address:  {address}</div>
      <div class="info">Latitude: {latitude}</div>
       <div class="info">Longtitude:{longtitude}</div>
       { photoUrl ?  <img className="image-container" src={photoUrl} /> : null }
    </div>
  );
}

export default SearchLocationInput;

