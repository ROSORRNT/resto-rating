import React ,{ useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { setUserPosition } from '../actions/mapActions';
import { Select, Input } from 'antd';
import MapMarker from '../components/MapMarker';
import PlaceCard from '../components/PlaceCard'
import MapStyle from '../components/Layout/MapStyle';
import MapAutoComplete from '../components/MapAutoComplete';
import UserMarker from '../components/UserMarker';

const MapContainer = ({  myMap: { userLocation }, setUserPosition }) => {

  useEffect(() => {
    setUserPosition();
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userPos, setUserPos] = useState({"lat": 43.664175, "lng": 7.139873599999987});
  const [star, setStar ] = useState(1)
  const [map, setMap] = useState({});
  const [mapsApi, setMapsApi] = useState({});
  const [zoom, setZoom] = useState(15)
  const [placesService, setPlacesService] = useState({});
  const [autoCompleteService, setAutoCompleteService] = useState({});
  const [geoCoderService, setGeoCoderService] = useState({});
  const [userMarkers, setUserMarkers] = useState([]);
  const [constrains, setConstrains] = useState([{name: ''}])
  let markers = []

  const apiHasLoaded = ((map, mapsApi) => {
    setUserPos(userLocation)
    setMap(map);
    setMapsApi(mapsApi);
    setPlacesService(new mapsApi.places.PlacesService(map));
    setAutoCompleteService(new mapsApi.places.AutocompleteService())
    setGeoCoderService(new mapsApi.Geocoder())
    setMapsLoaded(true);
  });

  const { Option } = Select;
  const createMapOptions = (() => {
    return {styles: MapStyle}
  })

  const onChangeHandler = (mapsApi) => {

    setUserPos(mapsApi.center)
    if(mapsLoaded === true){
      setZoom(map.getZoom())
      setBounds(map.getBounds())
      handleSearch(star)
    }
  }

  const updateName = (e) => {
    
    setConstrains({name: e.target.value})
  
  }

  const addMarker = ((lat, lng) => {
    
    let newUserMarker = {id: new Date(), lat, lng, name: constrains.name }
      setUserMarkers([
        ...userMarkers,
        newUserMarker
      ])
  });

  const handleSearch = ((value) => {
    
    setStar(value); // Set with option selected for filter
    const filteredResults = []; // restaurants Array
    const placesRequest = {

      bounds: map.getBounds(),
      radius: '1000', 
      type: ['restaurant'], 
      
    };
    placesService.nearbySearch(placesRequest, ((response) => {
  
      let filtered = response.filter( res => res.rating >= value)
      let photoUrl = ''
      filtered.map( res => {
        if(res.photos && res.photos[0].getUrl() !== undefined) {
            photoUrl = res.photos[0].getUrl()
        }
        const restoPlace = {id: res.id, name: res.name, photo: photoUrl, ratings: {stars: [res.rating], comments: []}, address:res.vicinity, coordinates: { lat:res.geometry.location.lat(),lng:res.geometry.location.lng() } }
        filteredResults.push(restoPlace)
     })
      setSearchResults(filteredResults);
    }));
  });

    return( 
      <div> 
        <div className="row">
          <div >    
            <section className="col s9 right">
              <div style={{ height: '100vh', width: 'auto', paddingTop: '1%' }} >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: 'AIzaSyBIWvyyq6RD5MTxy2Rpd24ZLO_0kYAaDLw',
                    libraries: ['places', 'directions']
                  }}
                  zoom={zoom} 
                  center={userPos}
                  options={createMapOptions}
                  onChange={onChangeHandler}
                  yesIWantToUseGoogleMapApiInternals={true}
                  onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
                >
                {searchResults.map(place => {
                 markers.push({id: place.id, name: place.name, lat: place.coordinates.lat, lng: place.coordinates.lng})       
                })}
                {markers.map(marker => {
                  return (
                    <MapMarker  key={marker.id}  lat={marker.lat} lng={marker.lng} />
                  );
               })}
               {userMarkers.map( marker => {
                  return (
                  <UserMarker  key={marker.id}  lat={marker.lat} lng={marker.lng} name={marker.name} />
                  )
                })}
                </GoogleMapReact>
              </div>
            </section>
          </div>

        {/* Results section */}
        <section  style={{paddingTop: '1px'}} className="col s3 left">
          <div >
          {mapsLoaded &&
            <div>
              <div >
                <Input placeholder="Nom du Restaurant" onChange={(event) => updateName(event)} />
                <MapAutoComplete
                  autoCompleteService={autoCompleteService}
                  geoCoderService={geoCoderService}
                  addMarker={addMarker}
                  map={map}
                />
              </div>
            </div>
          }
              
            <Select
              showSearch
              style={{ width: '90%', paddingTop: '3%' }}
              placeholder="Note minimale"
              optionFilterProp="children"
              onChange={(value) => handleSearch(value)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
              <Option value="1"> A partir de 1 ★ </Option>
              <Option value="2"> A partir de 2 ★ </Option>
              <Option value="3"> A partir de 3 ★ </Option>
              <Option value="4"> A partir de 4 ★ </Option>
              <Option value="5"> A partir de 5 ★ </Option>
            </Select>
          {searchResults.length > 0 ?
            <div className="collection ">
              <ul style={{height: '450px', width:'100%', overflow:'hidden', overflowY: 'scroll' }}>
              {searchResults.map((result) => (
                <PlaceCard resto={result} key={result.id}  /> 
              ))}
              </ul>
            </div>
          : null}
          </div>
        </section>
      </div>
    </div>
    );
};

const mapStateToProps = state => ({
  
  myMap: state.map,

 });

export default connect(mapStateToProps, { setUserPosition })(MapContainer);