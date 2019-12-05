import { 
    GET_RESTAURANTS
} from './types';

// Get Restaurants from serveur
// function returning takes a dispatch which allow us to dispatching to the reducer at any time 
// meaning we can make the request to our backend and then wait get the response an then dispatch to the reducer
export const getRestaurants = () => async dispatch => {
        const res = await fetch('http://localhost:5000/restaurants');
        const data = await res.json(); // stocker le corp de la requête en JSON
        dispatch({
            type: GET_RESTAURANTS,
            payload: data
        })
};
