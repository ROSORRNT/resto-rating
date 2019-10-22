import React from 'react';
import { Icon } from 'antd';

const UserMarker = (props) => {

  return (
    <div >
      <span style={{ fontSize: '15px', color: 'black'}}  className="brand-red "></span>
      <Icon className="font-1-5" type="environment" style={{ fontSize: '20px' }}   theme="twoTone" twoToneColor="#fd0000" />
    </div>
  );
};

export default UserMarker;