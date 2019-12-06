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
            let data = { lat: position.coords.latitude, lng: position.coords.longitude, permision: true }
            dispatch({
                type: SET_USER_POSITION,
                payload: data
            })    
        }, (error) => {
            // console.log(error.code) // if error.code === 1 //=> Message : géolocalisation refusée
            let data = {
                lat: 43.6535296,
                lng: 7.1458816, 
                permision: false
            }
            dispatch({
                type: SET_USER_POSITION,
                payload: data
            })
        });
    } else {
        let data = {
            lat: 43.6535296,
            lng: 7.1458816, 
            permision: false
        }
        dispatch({
            type: SET_USER_POSITION,
            payload: data
        })
    };
};

