import React ,{ useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { setUserPosition } from '../actions/mapActions';
import { Select, Modal, Input, message } from 'antd';

import MapMarker from '../components/MapMarker';
import PlaceCard from '../components/PlaceCard'
import MapStyle from '../components/Layout/MapStyle';
import MapAutoComplete from '../components/MapAutoComplete';
import UserMarker from '../components/UserMarker';
import UserPosMarker from '../components/UserPosMarker'

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
  //const [streetViewService, setStreetViewService] = useState({});
  const [userRestaurants, setUserRestaurants] = useState([]);
  const [restoAdded, setRestoAdded] = useState([])
  const [visible, setVisible] = useState(false) // Modal open when onMapClick
  let markers = []
  const [name, setName] = useState('')
  const [userPosMarker, setUserPosMarker] = useState({})

  const apiHasLoaded = ((map, mapsApi) => {
    setUserPos(userLocation)
    setMap(map);
    setMapsApi(mapsApi);
    setPlacesService(new mapsApi.places.PlacesService(map));
    setAutoCompleteService(new mapsApi.places.AutocompleteService())
    setGeoCoderService(new mapsApi.Geocoder())
    //setStreetViewService(new mapsApi.StreetViewService())
    setMapsLoaded(true);
    setUserPosMarker(userLocation)
  });

// Set options of the map
  const { Option } = Select;
  const createMapOptions = (() => {
    return {styles: MapStyle}
  })

// 
  const onChangeHandler = (mapsApi) => {
    setUserPos(mapsApi.center)
    if(mapsLoaded === true){
      setZoom(map.getZoom())
      handleSearch(star)
    }
  }

  const addRestaurant = ((address, lat, lng) => {
    let newUserRestaurant = {id: new Date(), address: address, lat, lng, name: name, ratings: {stars: [], comments: []}, photo: null  }
    setUserRestaurants([
      ...userRestaurants,
      newUserRestaurant
    ])
    message.success('Marqueur Ajouté', 4)
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

  const updateName = (e) => {
    setName(e.target.value)
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    let newrestoAdded = [...restoAdded]
    newrestoAdded[restoAdded.length - 1].name = name
    setRestoAdded(newrestoAdded)
    setVisible(false);
  };

   const handleCancel = e => {
    setVisible(false);
  };

  const onMapClick = ({lat, lng}) => {
    showModal()
    let newrestoAdded = [
      ...restoAdded, 
      {id: new Date(), lat: lat, lng: lng, name: '', ratings: {stars: [], comments: []}, photo: null}
    ]
    //console.log(streetViewService.getPanorama({location: location, radius: 50}))
    setRestoAdded(newrestoAdded)
  }

    return( 
      <div> 
        <div className="row">
          <div >    
            <section className="col s8 right">
              <div style={{ height: '100vh', width: 'auto'}} >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: 'AIzaSyBIWvyyq6RD5MTxy2Rpd24ZLO_0kYAaDLw',
                    libraries: ['places', 'streetview']
                  }}
                  zoom={zoom} 
                  center={userPos}
                  options={createMapOptions}
                  onChange={onChangeHandler}
                  yesIWantToUseGoogleMapApiInternals={true}
                  onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
                  onClick={onMapClick}
                >
                {searchResults.map(place => {
                  if(place.coordinates !== undefined){
                 markers.push({id: place.id, name: place.name, lat: place.coordinates.lat, lng: place.coordinates.lng})       
                }})}
                {markers.map(marker => {
                  return (
                    <MapMarker  key={marker.id} id={marker.id}  lat={marker.lat} lng={marker.lng} name={marker.name} />
                  );
               })}
               {restoAdded.map( marker => {
                  return (
                  <UserMarker  key={marker.id}   lat={marker.lat} lng={marker.lng} name={marker.name} />
                  )
                })}
                {userRestaurants.map( marker => {
                  return (
                  <UserMarker  key={marker.id}   lat={marker.lat} lng={marker.lng} name={marker.name} />
                  )
                })}
                {userPosMarker && 
                  <UserPosMarker key={new Date()} name="userPosition" lat={userPosMarker.lat} lng={userPosMarker.lng}  />
                }
                </GoogleMapReact>
                <Modal
                  title="Nommez Votre Restaurant"
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <Input
                    style={{ width: '83%' }}
                    allowClear={true} 
                    placeholder="Nom du Restaurant" 
                    onChange={(event) => updateName(event)} />
                </Modal>
              </div>
            </section>
          </div>

        {/* Results section */}
        <section  style={{paddingTop: '1px'}} className="col s4 left">
          <div >
          {mapsLoaded &&
            <div>
              <div >
                <Input
                style={{ width: '83%' }}
                allowClear={true} 
                placeholder="Nom du Restaurant" 
                onChange={(event) => updateName(event)} />
                        
                <MapAutoComplete
                  autoCompleteService={autoCompleteService}
                  geoCoderService={geoCoderService}
                  addRestaurant={addRestaurant}
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
              <Option value="1"> 1 à 5 ★ </Option>
              <Option value="2"> 2 à 5 ★ </Option>
              <Option value="3"> 3 à 5 ★ </Option>
              <Option value="4"> 4 à 5 ★ </Option>
              <Option value="5"> 5 à 5 ★ </Option>
            </Select>
          {searchResults.length > 0 ?
            <div>
              <ul style={{height: '490px', width:'100%', overflow:'hidden', overflowY: 'scroll', paddingTop: '1%' }}>
              {searchResults.map((result) => (
                <PlaceCard resto={result} key={result.id}  /> 
              ))}   
              {userRestaurants.length > 0 && 
              userRestaurants.map((result) => (
                <PlaceCard resto={result} key={result.id}  /> 
              ))}
              {restoAdded.length > 0 && 
                restoAdded.map((result) => (
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