import React ,{ useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { setUserPosition } from '../actions/mapActions';
import { Select } from 'antd';
import MapMarker from '../components/MapMarker';
//import NavBar from '../components/Layout/NavBar';
import PlaceCard from '../components/PlaceCard'
import MapStyle from '../components/Layout/MapStyle';
//import MapAutoComplete from '../components/MapAutoComplete'
import AddRestaurantModal from '../components/AddRestaurantModal';


const MapContainer = ({  myMap: { userLocation }, setUserPosition }) => {

  useEffect(() => {
    setUserPosition();
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userPos, setUserPos] = useState({"lat": 43.664175, "lng": 7.139873599999987});
  const [star, setStar ] = useState(1)
  //const [infoWindow, setInfoWindow] = useState([]);
  const [map, setMap] = useState({});
  const [mapsApi, setMapsApi] = useState({});
  const [zoom, setZoom] = useState(15)
  const [bounds, setBounds] = useState(null);
  //const [latLng, setLatLng] = useState({});
  //const [latLngBnds, setLatLngBnds] = useState({});
  const [placesService, setPlacesService] = useState({});
  const [autoCompleteService, setAutoCompleteService] = useState({});
  const [geoCoderService, setGeoCoderService] = useState({});
  let markers = []

  const apiHasLoaded = ((map, mapsApi) => {
    setUserPos(userLocation)
    setMap(map);
    setMapsApi(mapsApi);
    setPlacesService(new mapsApi.places.PlacesService(map));
    //setLatLng(new mapsApi.LatLng())
    //setLatLngBnds(new mapsApi.LatLngBounds())
    setAutoCompleteService(new mapsApi.places.AutocompleteService())
    setGeoCoderService(new mapsApi.Geocoder())
    setMapsLoaded(true);
    
  });

  const { Option } = Select;
  const createMapOptions = (() => {
    return {styles: MapStyle}
  })

  const onChangeHandler = (mapsApi) => {
    markers = []
    setUserPos(mapsApi.center)
    if(mapsLoaded === true){
            
      setZoom(map.getZoom())
      setBounds(map.getBounds())
     // myLatLng = new mapsApi.LatLng({lat: userPos.lat, lng: userPos.lng})
      //console.log(bounds)
      handleSearch(star)
    }
  }

  const handleSearch = ((value) => {
    
    setStar(value); // Set with option selected for filter
    
    const filteredResults = []; // restaurants Array
    const placesRequest = {
      location: {lat: userPos.lat, lng: userPos.lng},
      //radius: '30000', // Cannot be used with rankBy.
      type: ['restaurant'], 
      rankBy: mapsApi.places.RankBy.DISTANCE // Cannot be used with radius.
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
      <AddRestaurantModal mapsApi={mapsApi} autoCompleteService={autoCompleteService} geoCoderService={geoCoderService} />
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

               {/*markers.push({name: place.name, lat: place.coordinates.lat, lng: place.coordinates.lng})*/}

                return (
                  
                  <MapMarker  key={place.id} name={place.name} lat={place.coordinates.lat} lng={place.coordinates.lng} />
                  
                );
              })}
              </GoogleMapReact>
            </div>
          </section>
          </div>

        {/* Results section */}
        <section  style={{paddingTop: '1px'}} className="col s3 left">
          <div >
          <h5  className=" align-center">Recherche par note</h5>
            <Select
              showSearch
              style={{ width: '90%' }}
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
              <ul style={{height: '520px', width:'100%', overflow:'hidden', overflowY: 'scroll' }}>
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