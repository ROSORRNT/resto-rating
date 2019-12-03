import { 
    GET_RESTAURANTS, 
    SET_LOADING
} from './types';

// Get Restaurants from GOOGLE API *****

// Get Restaurants from serveur
// function returning takes a dispatch which allow us to dispatching to the reducer at any time 
// meaning we can make the request to our backend and then wait get the response an then dispatch to the reducer
export const getRestaurants = () => async dispatch => {
        setLoading();
        const res = await fetch('http://localhost:5000/restaurants');
        const data = await res.json(); 
        dispatch({
            type: GET_RESTAURANTS,
            payload: data
        })
};

//Set loading to true
export const setLoading = () => {
    return {
        type: SET_LOADING
    };
};