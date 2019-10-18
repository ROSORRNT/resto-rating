import React from 'react';
import { Icon } from 'antd';

const MapMarker = (props) => {

  return (
    <div >
      <span style={{ fontSize: '15px', color: 'black'}}  className="brand-red hide "></span>
      <Icon className="font-1-5" type="environment" style={{ fontSize: '20px' }}   theme="twoTone" twoToneColor="#fd0000" />
    
    </div>
  );
};

export default MapMarker;