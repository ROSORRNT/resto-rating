import React from 'react';
import { Icon } from 'antd';

const MapMarker = (props) => {
  let span
  let spanChild
  
/*
const onIcon = () => {
 
  if (span == undefined){
    
    span = document.getElementById(props.id)
    spanChild = document.createElement("span")
    spanChild.textContent = props.name
    span.appendChild(spanChild)
    
  }
}
*/

  return (
    <div>
     
      <span id={props.id} style={{ fontSize: '18px' }}  className="brand-red"></span>
      <Icon className="font-1-5" type="environment" style={{ fontSize: '20px' }}   theme="twoTone" twoToneColor="#fd0000" />
  
    </div>
  );
};

export default MapMarker;