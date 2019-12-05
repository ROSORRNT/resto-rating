import { 
    GET_RESTAURANTS
} from './types';

// Get Restaurants from serveur
// function returning takes a dispatch which allow us to dispatching to the reducer at any time 
// Je veux pouvoir attendre la réponse pour envoyer mon distach ensuite

export const getRestaurants = () => async dispatch => {
        const res = await fetch('http://localhost:5000/restaurants');
        const data = await res.json(); // stocker le corp de la requête en JSON
        dispatch({
            type: GET_RESTAURANTS,
            payload: data
        })
};
