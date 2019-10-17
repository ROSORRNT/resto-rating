import React, { useState } from 'react'
import { connect } from 'react-redux';
import { addRestaurant } from '../actions/restaurantActions';
import MapAutoComplete from './MapAutoComplete';
import M from 'materialize-css/dist/js/materialize.min.js';
import { AutoComplete } from 'antd';


const AddRestaurantModal = (props, { addRestaurant }) => {

    const [ restaurantName, setRestaurantName ] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({
      lat: null, 
      lng: null
    });
    const [ ratings ] = useState([]);

    
    const submitHandler = () => {
        const newResto = {
            restaurantName,
            address,
            coordinates,
            ratings
        }

        addRestaurant(newResto)
        M.toast({ html: 'Restaurant Ajouté'})
        
        // Clear Field
        setRestaurantName('');
        setAddress('');
    };
/*
    const selectHandler = async addrss => {
        const res = await geocodeByAddress(addrss);
        const latLng = await getLatLng(res[0]);
        setAddress(addrss);
        setCoordinates(latLng);
    }; 
*/
    return (
            <div id='add-restaurant-modal' className="modal"  >
                <div className="modal-content">
                    <h4>Ajoutez Votre Restaurant</h4>
                    <div className="row">
                        <div className="input-field">
                            <input 
                            type="text" 
                            name="restaurantName" 
                            value={restaurantName}
                            onChange={e => setRestaurantName (e.target.value)} 
                            />
                            <label htmlFor="restaurantName"     className="active">
                                Nom du Restaurant
                            </label>
                        </div> 
                    </div>    
                <div className="row">
                    <div className="input-field">
                        <AutoComplete
                        
                        
                         />
                        </div> 
                    </div>
                </div>
            <div className="modal-footer">
                <a href="#!"
                onClick={submitHandler}
                className="modal-close waves-effect #ef6c00 orange darken-3 wave-light btn"
                >
                    Entrer
                </a>  
            </div>
        </div>
    );
};

export default connect(null, { addRestaurant })(AddRestaurantModal);
