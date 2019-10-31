import React ,{ useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { setUserPosition } from '../actions/mapActions';
import { getRestaurants } from '../actions/restaurantActions';
import { Select, Modal, Input, message } from 'antd';
import MapMarker from '../components/MapMarker';
import PlaceCard from '../components/PlaceCard';
import MapStyle from '../components/Layout/MapStyle';
import MapAutoComplete from '../components/MapAutoComplete';
import UserMarker from '../components/UserMarker';
import UserPosMarker from '../components/UserPosMarker';

const MapContainer = ( {restaurant: { restaurants },  getRestaurants, myMap: { userLocation }, setUserPosition} ) => {

  useEffect(() => {
    setUserPosition();
    getRestaurants();
  }, []);

  const [searchResults, setSearchResults] = useState([]); // results of nearbySearch request 
  const [mapsLoaded, setMapsLoaded] = useState(false); // reset to true when api has loaded
  const [userPos, setUserPos] = useState({"lat": 43.664175, "lng": 7.139873599999987}); // for set center of map with userLocation
  const [star, setStar ] = useState(1); //filter option
  const [map, setMap] = useState({}); // for manipulate the map ex: map.getBounds()
  const [mapsApi, setMapsApi] = useState({}); // to access service ex: mapsApi.Geocoder()
  const [zoom, setZoom] = useState(15); 
  const [placesService, setPlacesService] = useState({});
  const [autoCompleteService, setAutoCompleteService] = useState({});
  const [geoCoderService, setGeoCoderService] = useState({});
  const [streetViewService, setStreetViewService] = useState({});
  const [restoAdded, setRestoAdded] = useState([]); // user's restaurants list
  const [visible, setVisible] = useState(false); // Modal open when onMapClick
  const [name, setName] = useState(''); // set in updateName() for all restoAdded
  const [address, setAddress] = useState(''); // set in updateAddress() for all restoAdded
  const [userPosMarker, setUserPosMarker] = useState({}); 
  let markers = [];
  
  const apiHasLoaded = ((map, mapsApi) => {
    setUserPos(userLocation)
    setMap(map);
    setMapsApi(mapsApi);
    setPlacesService(new mapsApi.places.PlacesService(map));
    setAutoCompleteService(new mapsApi.places.AutocompleteService())
    setGeoCoderService(new mapsApi.Geocoder())
    setStreetViewService(new mapsApi.StreetViewService())
    setMapsLoaded(true);
    setUserPosMarker(userLocation)
    // SStorage of recovered restaurants from JSON file
    if(restaurants != null ) {
      let restoList = []
      restaurants.map(resto => {
        let restoRating = {
          stars: resto.ratings.map( res => res.stars),
          comment: resto.ratings.map( res => res.comment)
        }
        let userResto = {id: resto.id, address: resto.address, lat: resto.coordinates.lat, lng: resto.coordinates.lng, name: resto.name, stars: restoRating.stars, comments: restoRating.comment, photo: null, restoUser: true }
        restoList.push(userResto) 
        let newRestoList = [
          ...restoList
        ]
        setRestoAdded(newRestoList)
      })
    }
  });

  const { Option } = Select;
  // Set options of the map
  const createMapOptions = (() => {
    return {styles: MapStyle,
      streetViewControl: false }
  })

// call when a change occurs on the map
  const onChangeHandler = (mapsApi) => {
    setUserPos(mapsApi.center)
    if(mapsLoaded === true){
      setZoom(map.getZoom())
      handleSearch(star)
    }
  }
// Call when user add a restaurant by the autocomplete input (not onMapClick)
  const addRestaurant = ((address, lat, lng) => {
    let newUserRestaurant = {id: new Date(), address: address, lat, lng, name: name, stars: [], comments: [], photo: null, restoUser: true  }
    setRestoAdded([
      ...restoAdded,
      newUserRestaurant
    ])
    message.success('Marqueur Ajouté', 4)
  });
// Call on the first loading and each time the user selects an option (for filtering)
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
        const restoPlace = {id: res.id, name: res.name, photo: photoUrl, restoUser: false, stars: [res.rating], comments: [], address:res.vicinity, coordinates: { lat:res.geometry.location.lat(),lng:res.geometry.location.lng() } }
        filteredResults.push(restoPlace)
     })
      setSearchResults(filteredResults);
    }));
  });

  const updateName = (e) => {
    setName(e.target.value)
  }

  const updateAddress = (e) => {
    setAddress(e.target.value)
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    let newrestoAdded = [...restoAdded]
    newrestoAdded[restoAdded.length - 1].name = name // set in updateName()
    newrestoAdded[restoAdded.length - 1].address = address // set in updateAdress()
    setRestoAdded(newrestoAdded)
    setVisible(false);
    let location = {
      lat: restoAdded[restoAdded.length - 1].lat,
      lng: restoAdded[restoAdded.length - 1].lng
    }

    let streetV = map.getStreetView()
    streetV.setPosition(location);
    streetV.setPov(/** @type {google.maps.StreetViewPov} */({
      heading: 265,
      pitch: 0
    }));
    streetV.setVisible(true)
    
  };

   const handleCancel = e => {
    let newrestoAdded = [...restoAdded]
    newrestoAdded.pop()
    setRestoAdded(newrestoAdded)
    setVisible(false);
  };

  const onMapClick = ({lat, lng}) => {
    showModal()
    let newrestoAdded = [
      ...restoAdded, 
      {id: new Date(), lat: lat, lng: lng, name: '', stars: [], comments: [], photo: null, restoUser: true}
    ]
    setRestoAdded(newrestoAdded)
  }
  const onDelete = (id) => {
      
    let newResults = searchResults.filter( res => res.id !== id)
    setSearchResults(newResults)
    let newAdded = restoAdded.filter(res => res.id !== id)
    setRestoAdded(newAdded)
    message.success('Restaurant Supprimé', 4)
  }

  const onStreet = (id) => {
    let resto = restoAdded.filter( res => res.id == id)
    let location = {
      lat: resto[0].lat,
      lng: resto[0].lng
    }
    let streetV = map.getStreetView()
    streetV.setPosition(location);
    streetV.setPov(/** @type {google.maps.StreetViewPov} */({
      heading: 265,
      pitch: 0
    }));
    streetV.setVisible(true)
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
                  <Input
                    style={{ width: '83%' }}
                    allowClear={true} 
                    placeholder="Adresse du Restaurant" 
                    onChange={(event) => updateAddress(event)} />
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
              {/* user's restaurants results */}
              <h5>Votre liste</h5>
              { restoAdded.length == 0 &&
              <p style={{color: 'grey'}} >Votre liste est vide</p>
              }
              { restoAdded.length > 0  &&             
                restoAdded.map((result) => (
                <PlaceCard resto={result} key={result.id} onDelete={onDelete} onStreet={onStreet} filterOption={star} /> 
              ))} 
              {/* nearby request results */}
              
              <h5>Nos résultats</h5>
              {searchResults.map((result) => (
                <PlaceCard resto={result} key={result.id} onDelete={onDelete}  /> 
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
  restaurant: state.restaurant,
  myMap: state.map,
 });

export default connect(mapStateToProps, { setUserPosition, getRestaurants })(MapContainer);