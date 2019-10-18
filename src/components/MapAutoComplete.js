import React, { useState } from 'react';
import { AutoComplete } from 'antd';



const MapAutoComplete = (props) => {
  
    const [suggestionts, setSuggestionts] = useState([]);
    const [dataSource, setDataSource] = useState([]);

  // Runs after clicking / Geocode the location selected to be created as a marker.

  const onSelect = ((value) => {
    props.geoCoderService.geocode({ address: value }, ((response) => {
      props.addMarker( response[0].geometry.location.lat(), response[0].geometry.location.lng());
    }))
  });

  // Runs a search on the current value as the user types in the AutoComplete field.
  const handleSearch = ((value) => {
    
    if (value.length > 0) {
      const searchQuery = {
        input: value,
        bounds : props.map.getBounds(), 
        radius: 1000,       
      };
      props.autoCompleteService.getPlacePredictions(searchQuery, ((response) => {
          
        // The name of each GoogleMaps suggestion object is in the "description" field
        if (response) {           
          const data = response.map((resp) => resp.description);
          setDataSource(data);
          setSuggestionts(response)
        }
      }));
    }
  });
 
    return (
      
      <div>

      <AutoComplete
        dataSource={dataSource}
        onSelect={onSelect}
        onSearch={handleSearch}
        allowClear={true} 
        style={{ height: 30, width: '90%' }}
        placeholder="Address"
     />
      </div>
    );
}

export default MapAutoComplete;