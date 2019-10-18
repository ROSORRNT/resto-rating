import React, {useState} from 'react';
import { Rate, Input, Card, Comment, Tooltip } from 'antd';
import moment from 'moment';
//import Preloader from './Layout/Preloader';

const PlaceCard = (({ resto }) => {

  const arrayStars = resto.ratings.stars.map(star => star)
  const [showInput, setShowInput] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false)
  const [userComment, setUserComment] = useState('');
  const [stars, setStars] = useState(arrayStars[0]);

  const getComment = (e) => {
    
    setUserComment(e.target.value);
    setShowInput(true);

  }

  const showPhotoHandler = () => {
    setShowPhoto(!showPhoto);
  }

  const getStars = (e) => {
    let newArrayStars = [
      ...arrayStars,
      e
    ]
    newArrayStars = Math.ceil((newArrayStars.reduce((sum, stars) => 
    {
        return sum + stars
    }, 0) / newArrayStars.length))
    setStars(newArrayStars)
  }

  return (
    <li key={resto.id} className="collection-header">
      
      <div className="card">
        <div className="card-body">
          <a href="#!"><h4 onClick={showPhotoHandler} className="card-title">{resto.name}</h4></a>
          <span >{resto.address}</span>
        </div>
        <span> Note : <Rate 
          value={stars} 
          onChange={(e) => getStars(e) }
          />
        </span>
        { showInput === false &&
        <Input 
          placeholder="Votre commentaire"
          type="textarea"
          allowClear={true}
          onPressEnter={(e) => getComment(e)} />
        }
        {userComment.length > 3 && 
        <Comment 
          content={userComment}
          author={<a href="#!">Han Solo</a>}
          datetime={
            <Tooltip title={moment().format('YYYY-MM-DD   HH:mm:ss')}>
              <span>{moment().fromNow()}</span>
            </Tooltip>
        }/>}
        </div>
        {    
          <Card
            hoverable
            style={{ width: '100%', height: 'auto' }}
            cover={<img alt="example" src={resto.photo} />}
          />
        }
    </li>
  );
});

export default PlaceCard;