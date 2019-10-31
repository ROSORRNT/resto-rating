import { 
    GET_RESTAURANTS, 
    ADD_RESTAURANT, 
    SET_LOADING, 
    DELETE_RESTAURANT, 
    UPDATE_RESTAURANT,
    SET_CURRENT, 
    CLEAR_CURRENT,
    SEARCH_RESTAURANTS
} from './types';

// Get Restaurants from GOOGLE API *****

// Get Restaurants from serveur
export const getRestaurants = () => async dispatch => {
    /*redux thunk allows us to returning a function directly 
    it takes a dispatch which allow us to dispatch to the reducer at any time (dispatch a type and a payload)
    meaning we can make the request to our backend and then wait get the response an then dispatch to the reducer
    */
        setLoading();
        const res = await fetch('http://localhost:5000/restaurants');
        const data = await res.json(); 
        dispatch({
            type: GET_RESTAURANTS,
            payload: data
        })
};

// Add Restaurant
export const addRestaurant = (restaurant) => async dispatch => {

        setLoading();
        const res = await fetch('/restaurants', {
            method: 'POST',
            body: JSON.stringify(restaurant),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json(); 

        dispatch({
            type: ADD_RESTAURANT,
            payload: data
        })
};

// Delete Restaurant 
export const deleteRestaurant = (id) => async dispatch => {

      
        setLoading();

        await fetch(`/restaurants/${id}`, {
            method: 'DELETE'
        });

        dispatch({
            type: DELETE_RESTAURANT,
            payload: id
        })
};

// Upload restaurant on server **restaurant = the updated version
export const updateRestaurant = (restaurant) => async dispatch => {
      
    setLoading();

    const res = await fetch(`/restaurants/${restaurant.id}`, {
        method: 'PUT',
        body: JSON.stringify(restaurant),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();

    dispatch({
        type: UPDATE_RESTAURANT,
        payload: data 
    })
};

// Search server Restaurants
export const searchRestaurants = (text) => async dispatch => {

    setLoading();

    const res = await fetch(`/restaurants?q=${text}`);
    const data = await res.json(); 

    dispatch({
        type: SEARCH_RESTAURANTS,
        payload: data
    })
};

// Definir le restaurant actuel 
export const setCurrent = restaurant => {
    return {
        type: SET_CURRENT,
        payload: restaurant 
    }
};

// Nettoyer le restaurant actuel 
const clearCurrent = () => {
    return {
        type: CLEAR_CURRENT
    }
};


//Set loading to true
export const setLoading = () => {
    return {
        type: SET_LOADING
    };
};