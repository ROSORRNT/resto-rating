import { 
    SET_USER_POSITION
} from './types';

// Set user position from Geolocation API
/* redux thunk nous permet de retourner une fonction directement
elle prend un dispatch qui nous permette d’envoyer au reducer à tout moment (dispatch a type and a payload)
Ainsi nous pouvons effectuer notre et attendre la réponse pour l'envoyer au reducer
*/
export const getUserPosition = () => (dispatch) => {
    if ("geolocation" in navigator) {
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

