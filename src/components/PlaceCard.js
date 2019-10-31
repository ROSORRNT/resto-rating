import React, {useState} from 'react';
import { Rate, Input, Card, Comment, Tooltip, message } from 'antd';
import moment from 'moment';

const PlaceCard = (({ resto, onDelete, onStreet, filterOption }) => {

  const [showInput, setShowInput] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showComments, setShowComments] = useState(false);
  let arrayStars = resto.stars.map( stars => stars); // Pour récupérer les notes déjà existantes sur le JSON
  let starsAverage = Math.round(arrayStars.reduce((sum, stars) => {
      return sum + stars
  }, 0) / arrayStars.length)
  const [stars, setStars] = useState(starsAverage);
  let commentList = resto.comments.map( comment => comment) // Pour récupérer les commentaires déjà existants sur le JSON
  const [comments, setComments] = useState(commentList);

  const showPhotoHandler = () => {
    setShowPhoto(!showPhoto);
  }

  const showCommentHandler = () => {
    setShowComments(!showComments)
  }

  const commentEdit = (e) => {
    let newComments = [
      ...comments,
      e.target.value
    ]
    setComments(newComments);
    setShowInput(true);
    setShowComments(true);
    message.success('Commentaire ajouté')    
  }

  const starsEdit = (e) => {
    let newArrayStars = [
      ...arrayStars,
      e
    ]
    newArrayStars = Math.ceil((newArrayStars.reduce((sum, stars) => {
      return sum + stars
    }, 0) / newArrayStars.length))
    setStars(newArrayStars)
    message.success('Note Ajoutée')
  }
  
  let color = 'rgb(219, 208, 201)'

  if (resto.restoUser === true) {
     color = 'rgb(255, 209, 182)'
  }

  let hide = 'collection-item'

  if (filterOption !== undefined && stars < filterOption) {
    hide = 'hide'
  }

  return (
    <li key={resto.id} className={`${hide}`} >
      <div className="card" style={{backgroundColor: `${color}`}}>
        <div className="card-body" >
          <a href="#!" 
            onClick={(id) => onDelete(resto.id)} 
            className="secondary-content">
            <i className="material-icons grey-text">delete</i>
          </a>
          
          { resto.photo == null && 
            <a href="#!" 
              onClick={(id) => onStreet(resto.id)} 
              className="secondary-content">
              <i className="material-icons grey-text">visibility</i>
            </a>
          }
          { resto.photo !== null && 
            <a href="#!" 
              onClick={showPhotoHandler} 
              className="secondary-content">
              <i className="material-icons grey-text">visibility</i>
            </a>
          }
          <a href="#!" 
            onClick={(id) => showCommentHandler()} 
            className="secondary-content">
            <i className="material-icons grey-text">comment</i>
          </a>
          <a href="#!"><h4 className="card-title">{resto.name}</h4></a>
          <span >{resto.address}</span>
        </div>
          <span> Note : 
            <Rate 
              value={stars} 
              onChange={(e) => starsEdit(e) }
            />
          </span>

        { showInput === false &&
        <Input 
          placeholder="Votre commentaire"
          type="textarea"
          allowClear={true}
          onPressEnter={(e) => commentEdit(e)} />
        }
        <ul>
          {showComments && comments.map( comment => {
            return (
              <li key={Math.random()}>
                <Comment 
                  style={{backgroundColor: 'rgb(255, 255, 255)'}}
                  content={comment}
                  author={<a href="#!">Han Solo</a>}
                  datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD   HH:mm:ss')}>
                      <span>{moment().fromNow()}</span>
                    </Tooltip>
                  }
                />
              </li>
            )
          })}
        </ul>
        </div>
        { resto.photo !== null && showPhoto &&
          <Card
            hoverable
            style={{ width: '100%', height: 'auto' }}
            cover={<img id={resto.id} alt="example" src={resto.photo} />}
          />
        }
    </li>
  );
});

export default PlaceCard;