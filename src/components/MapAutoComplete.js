import React, { useState } from 'react';
import { AutoComplete } from 'antd';

const MapAutoComplete = (props) => {
  
    const [suggestionts, setSuggestionts] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [geoCoderService, setGeoCoderService] = useState({});
    const [autoCompleteService, setAutoCompleteService] = useState({});

    if(props.mapsLoaded === true){
    setAutoCompleteService(new props.mapsApi.places.AutocompleteService());
    setGeoCoderService(new props.mapsApi.Geocoder())}

  // Runs after clicking away from the input field or pressing 'enter'.
  // Geocode the location selected to be created as a marker.
  const onSelect = ((value) => {
      
    geoCoderService.geocode({ address: value }, ((response) => {
   
      props.addMarker( response[0].geometry.location.lat(), response[0].geometry.location.lng());
    }))
  });

  // Runs a search on the current value as the user types in the AutoComplete field.
  const handleSearch = ((value) => {
   
    // Search only if there is a string
    if (value.length > 0) {
       
      const searchQuery = {
        input: value,
        location: props.userPos, 
        radius: 30000, // With a 30km radius,
        //type: ['address']
      };
      
      autoCompleteService.getPlacePredictions(searchQuery, ((response) => {
          
        // The name of each GoogleMaps suggestion object is in the "description" field
        if (response) {
            
          const data = response.map((resp) => resp.description);
          setDataSource(data);
        
          setSuggestionts(response)
        }
      }), 'OK');
    }
  });
 

    return (
      <AutoComplete
        className="w-100"
        dataSource={dataSource}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="Address"
      />
    );
}

export default MapAutoComplete;