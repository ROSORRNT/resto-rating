import React, {useEffect} from 'react';
import MapContainer from './containers/MapContainer';
import { Provider } from 'react-redux';
import store from './store';
//import AddBtn from './components/Layout/AddBtn';

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'antd/dist/antd.css';

const App = () => {

  useEffect(() => {

    // Init Materialize JS
    M.AutoInit();
  
  });

  return (
    <Provider store={store}>
      <div className="App">
          <div className="container-fluid">
            <MapContainer />
           {/* <AddBtn />*/}
           
          </div>
      </div>
    </Provider>
  );
}

export default App;
