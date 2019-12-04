import React ,{ useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { getUserPosition } from '../actions/mapActions';
import { getRestaurants } from '../actions/restaurantActions';
import { Select, Modal, Input, message } from 'antd';
import MapMarker from '../components/MapMarker';
import PlaceCard from '../components/PlaceCard';
import MapStyle from '../components/Layout/MapStyle';
import MapAutoComplete from '../components/MapAutoComplete';
import UserPosMarker from '../components/UserPosMarker';

const MapContainer = ( {restaurant: { restaurants },  getRestaurants, myMap: { userLocation }, getUserPosition} ) => {

  // Call the action that will fetch the restaurants on the server
  useEffect(() => {
    getRestaurants();
  }, [getRestaurants]);

  // Creates a list from recovered restaurants from JSON file
  useEffect(() => {
    if (restaurants !== null){
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
        setRestoAdded(newRestoList);
      })
    }
  }, [restaurants]);

  // Call the action that retrieves the user’s position
  useEffect(() => {
    getUserPosition();
  }, [getUserPosition]);

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
  // const [infoWindow, setInfoWindow] = useState({});
  const [restoAdded, setRestoAdded] = useState([]); // user's restaurants list
  const [visible, setVisible] = useState(false); // set Modal visibility when click we click on map
  const [name, setName] = useState(''); // set name form all restoAdded in updateName()
  const [address, setAddress] = useState(''); // set in updateAddress() for all restoAdded
  const [userPosMarker, setUserPosMarker] = useState({}); 
  let markers = [];

  // Call when the api has loaded 
  const apiHasLoaded = ((map, mapsApi) => {
    setUserPos(userLocation);
    setUserPosMarker(userLocation);
    setMap(map);
    setMapsApi(mapsApi);
    // setInfoWindow(new mapsApi.InfoWindow());
    setPlacesService(new mapsApi.places.PlacesService(map));
    setAutoCompleteService(new mapsApi.places.AutocompleteService());
    setGeoCoderService(new mapsApi.Geocoder());
    setMapsLoaded(true);
  });

  // Set options of the map
  const { Option } = Select;
  const createMapOptions = (() => {
    return {styles: MapStyle,
      streetViewControl: false }
  })

  // Called when a change occurs on the map
  const onChangeHandler = (mapsApi) => {
    setUserPos(mapsApi.center)
    if(mapsLoaded === true){
      setZoom(map.getZoom())
      handleSearch(star)
    }
  }

  // Called on the first loading, each time an option has selected, and when a change occurs on the map
  const handleSearch = ((value) => { 
    setStar(value); // Set with option selected for filter (star)
    const filteredResults = [];
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

  // Call when user add a restaurant by the autocomplete input (not onMapClick)
  const addRestaurant = ((address, lat, lng) => {
    let newUserRestaurant = {
      id: new Date(), address: address, lat, lng, name: name, stars: [], comments: [], photo: null, restoUser:true  
    };
    setRestoAdded([
      newUserRestaurant,
      ...restoAdded
    ]);
    message.success('Marqueur Ajouté', 4);
  });

  const showModal = () => {
    setVisible(true);
  };

  // Set the name that has just been added
  const updateName = (e) => {
    setName(e.target.value);
  }

  // const updateAddress = (e) => {
  //   setAddress(e.target.value)
  // }

  // Add a new restaurant with the coordinate of the click
  const onMapClick = ({lat, lng}) => {
    showModal();
    let newrestoAdded = [
      {id: new Date(), lat: lat, lng: lng, name: '', stars: [], comments: [], photo: null, restoUser: true},
      ...restoAdded
    ]
    setRestoAdded(newrestoAdded)
  }

  // Set the updated name of the restauant that has just been added
  const handleOk = () => {
    let newrestoAdded = [...restoAdded]
    newrestoAdded[0].name = name // set in updateName()
    newrestoAdded[0].address = address // set in updateAdress()
    setRestoAdded(newrestoAdded)
    setVisible(false)
  };

  // delete the item that has just been added
   const handleCancel = e => {
    let newrestoAdded = [...restoAdded]
    newrestoAdded.pop()
    setRestoAdded(newrestoAdded)
    setVisible(false);
  };

// Delete a restaurant
  const onDelete = (id) => {
    let newResults = searchResults.filter( res => res.id !== id)
    setSearchResults(newResults)
    let newAdded = restoAdded.filter(res => res.id !== id)
    setRestoAdded(newAdded)
    message.success('Restaurant Supprimé', 4)
  }

// Get and display the street view of a restauarnt 
  const onStreet = (id) => {
    let resto = restoAdded.filter( res => res.id === id)
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
                {/* Create the marker list with the search results*/}
                {searchResults.map(place => {
                  if(place.coordinates !== undefined){
                 markers.push({id: place.id, name: place.name, lat: place.coordinates.lat, lng: place.coordinates.lng})       
                }})}
                {/* render the list of markers ( for restaurants recovered)*/} 
                {markers.map(marker => {
                  return (
                    <MapMarker  key={marker.id} id={marker.id}  lat={marker.lat} lng={marker.lng} name={marker.name} restoUser={false} />
                  );
               })}
               {/* Render the list of markers (for restaurants added)*/} 
               {restoAdded.map( marker => {
                  return (
                    <MapMarker  key={marker.id} id={marker.id}  lat={marker.lat} lng={marker.lng} name={marker.name} restoUser={true} />
                  )
                })}
                {/* Render the user position marker */}
                {userPosMarker && 
                  <UserPosMarker key={new Date()} name="userPosition" lat={userPosMarker.lat} lng={userPosMarker.lng}  />
                }
                </GoogleMapReact> 

                {/* Modal for adding restaurant when the user click on map */}
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
                  {/* <Input
                    style={{ width: '83%' }}
                    allowClear={true} 
                    placeholder="Adresse du Restaurant" 
                    onChange={(event) => updateAddress(event)} /> */}
                </Modal>
              </div>
            </section>
          </div>

        <section  style={{paddingTop: '1px'}} className="col s4 left">
          <div >
          {mapsLoaded &&
            <React.Fragment>
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
            </React.Fragment>
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
            {/* Qwery Results */}
          {searchResults.length > 0 ?
            <div>
              <ul style={{height: '490px', width:'100%', overflow:'hidden', overflowY: 'scroll', paddingTop: '1%' }}>
              {/* user's restaurants results */}
              <h5>Votre liste</h5>
              { restoAdded.length === 0 &&
              <p style={{color: 'grey'}} >Votre liste est vide</p>
              }
              { restoAdded.length > 0  &&             
                restoAdded.map((result) => (
                <PlaceCard resto={result} key={result.id} onDelete={onDelete} onStreet={onStreet} filterOption={star} /> 
              ))} 
              {/* nearby request results */}
              <h5>Nos résultats</h5>
              {searchResults.map((result) => (
                <PlaceCard resto={result} key={result.id} onDelete={onDelete} filterOption={star} /> 
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

export default connect(mapStateToProps, { getUserPosition, getRestaurants })(MapContainer);