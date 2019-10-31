import React from 'react';
import { Icon } from 'antd';

const UserMarker = (props) => {
console.log(props)
  return (
    <div >
      <span style={{ fontSize: '15px', color: 'black'}}  className="brand-blue "></span>
      <Icon className="font-1-5" type="environment" style={{ fontSize: '20px' }}   theme="twoTone" twoToneColor="#FFB310" />
    </div>
  );
};

export default UserMarker;