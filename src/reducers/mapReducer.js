import { 
    SET_USER_POSITION,
    SET_LOADING
} from '../actions/types';

const initialState = {

    userLocation: {
      lat: '43.912190', 
      lng: '6.794206'
    },
    loading: false
    
}

export default(state = initialState, action) => {
    switch(action.type) {
        case SET_USER_POSITION:
            return {
                ...state,
                userLocation: action.payload,
                loading: false
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


 