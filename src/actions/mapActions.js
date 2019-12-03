import { 
    SET_USER_POSITION,
    SET_LOADING,
} from './types';

// Set user position from Geolocation API
/* redux thunk allows us to returning a function directly 
it takes a dispatch which allow us to dispatch to the reducer at any time (dispatch a type and a payload)
meaning we can make the request to our backend and then wait get the response an then dispatch to the reducer
*/
export const getUserPosition = () => async (dispatch) => {
    if ("geolocation" in navigator) {
        setLoading();
        navigator.geolocation.getCurrentPosition((position) => {
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

//Set loading to true
export const setLoading = () => {
    return {
        type: SET_LOADING
    };
};

