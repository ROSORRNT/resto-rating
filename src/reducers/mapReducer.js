import { 
    SET_USER_POSITION
} from '../actions/types';

const initialState = {
    userLocation: {
        lat: 43.6535296, 
        lng: 7.1458816
    }
};

export default(state = initialState, action) => {
    switch(action.type) {
        case SET_USER_POSITION:
            return {
                // ...state,
                userLocation: action.payload
            };
        default: 
        return state;
    };
};