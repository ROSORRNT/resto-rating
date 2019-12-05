import { 
    SET_USER_POSITION
} from '../actions/types';

const initialState = {
    userLocation: {
      lat: '43.912190', 
      lng: '6.794206'
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