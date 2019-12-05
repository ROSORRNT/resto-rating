import React, { useState } from 'react';
import { Icon } from 'antd';

const MapMarker = (props) => {

  const [visibility, setVisibility] = useState('hide');
  const { name, restoUser } = props;
  let colorTone = '';

  if (restoUser === true ) {
    colorTone = '#FFB310'
  } else {
   colorTone = '#fd0000'
  };

  const visibilityHandler = () => {
    if (visibility === 'hide') {
      setVisibility('')
    } else {
      setVisibility('hide')
    }
  };

  return (
    <div>
      <span 
        id={props.id}
        style={{ fontSize: '16px', color: 'black' }}  
        className="brand-red">
          <Icon className="font-1-5"
            onClick={visibilityHandler}
            type="environment" style={{ fontSize: '20px' }}   theme="twoTone" twoToneColor={colorTone} 
          />
        <p className={visibility} style={{backgroundColor: '#ffffff', opacity: '0.8'}}> {name}</p>
      </span>
    </div>
  );
};

export default MapMarker;