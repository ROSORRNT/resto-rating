import { combineReducers } from 'redux';

import mapReducer from './mapReducer';

export default combineReducers({
    // what PART of our app we're calling in our state
   // restaurant: restaurantReducer,
    map: mapReducer
});