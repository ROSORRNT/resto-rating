import { 
    GET_RESTAURANTS, 
    ADD_RESTAURANT, 
    SET_LOADING, 
    DELETE_RESTAURANT, 
    UPDATE_RESTAURANT,
    SET_CURRENT,
    CLEAR_CURRENT,
    SEARCH_RESTAURANTS
} from '../actions/types';

const initialState = {
    restaurants: null,
    current: null,
    loading: false,
    error: null
}

export default(state = initialState, action) => {
    switch(action.type) {
        case GET_RESTAURANTS: 
            return {
                ...state,
                restaurants: action.payload,
                loading: false
            };
        case ADD_RESTAURANT:
            return {
                ...state,
                restaurants: [...state.restaurants, action.payload],
                loading: false
            };
        case DELETE_RESTAURANT: 
            return {
                ...state, 
                restaurants: state.restaurants.filter(log => log.id !==  action.payload), 
                loading: false
            };
        case UPDATE_RESTAURANT: 
            return {
                ...state,
                restaurants: state.restaurants.map( resto => resto.id === action.payload.id ? action.payload : resto)
            };
        case SEARCH_RESTAURANTS: 
        return {
            ...state,
            restaurants: action.payload
        }
        case SET_CURRENT: 
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT: 
            return {
                ...state,
                current: null
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true 
            };
        
        default: 
        return state;
    }
}