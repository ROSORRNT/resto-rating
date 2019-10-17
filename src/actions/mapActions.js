import { 
    SET_USER_POSITION,
    SET_LOADING,
} from './types';

// Set user position from Geolocation API

export const setUserPosition = () => async dispatch => {

    if ("geolocation" in navigator) {

        setLoading();

        navigator.geolocation.getCurrentPosition(function(position) {

            const data = { lat: position.coords.latitude, lng: position.coords.longitude }

            dispatch({
                type: SET_USER_POSITION,
                payload: data
            })    
          });
      
      } else {

            const data = { lat: null, lng: null }
            
            dispatch({
                type: SET_USER_POSITION,
                payload: data
            })
      };
};

// Get Places 


//Set loading to true
export const setLoading = () => {
    return {
        type: SET_LOADING
    };
};

