import React, {useState} from 'react';
import { Rate, Input, Card, Comment, message } from 'antd';

const PlaceCard = (({ resto, onDelete, onStreet, filterOption, restoUser, placesService }) => {

  const [showInput, setShowInput] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showComments, setShowComments] = useState(false);
  // Récupérer les notes et commentaires déjà existants sur le JSON
  let arrayStars = [...resto.stars]; 
  let starsAverage = Math.round(arrayStars.reduce((sum, stars) => {
      return sum + stars
  }, 0) / arrayStars.length)
  let commentList = [...resto.comments];
  const [comments, setComments] = useState(commentList);
  const [authors, setAuthors] = useState([]); 
  const [stars, setStars] = useState(starsAverage);
  const [canRate, setCanRate] = useState(true);


  const showPhotoHandler = () => {
    setShowPhoto(!showPhoto);
  }

  const showCommentHandler = () => {
    if(restoUser === false && showComments === false && comments.length === 0) {
      const req = {
        placeId: resto.placeId,
        fields: ['reviews']
      };
      placesService.getDetails(req, (res => {
        let commentsList = []
        res.reviews.map( res => {
          commentsList.push({text : res.text, author: res.author_name})
        });
        let newComments = [
          ...comments,
          ...commentsList
        ];
        setComments(newComments);
        setShowComments(true);
      }));
    }
    setShowComments(!showComments)
  };

  const commentEdit = (e) => {
    let newComments = [
      ...comments,
      e.target.value
    ]
    setComments(newComments);
    setShowInput(true); // Delete this line allow the user to put multiple comments
    setShowComments(true);
    message.success('Commentaire ajouté')    
  }

  const starsEdit = (e) => {
    if (canRate === false) {
      message.error('Note déja ajoutée')   
    } else {
      let newArrayStars = [
        ...arrayStars,
        e
      ]
      newArrayStars = Math.ceil((newArrayStars.reduce((sum, stars) => {
        return sum + stars
      }, 0) / newArrayStars.length))
      setStars(newArrayStars)
      setCanRate(false)
      message.success('Note Ajoutée')
    }
  }

  // Définir une couleur spéciale pour les restaurants de l'utilisateur
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
              onClick={() => onStreet(resto.id)} 
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
        {/* iteration du composant Comment */}
        <ul>
          {restoUser 
          && showComments 
          && comments.map( comment => {
            return (
              <li key={Math.random()}>
                <Comment 
                  style={{backgroundColor: 'rgb(255, 255, 255)'}}
                  content={comment}
                  author={<span style={{fontStyle: 'bold', fontSize: '16px'}}>Han Solo</span>}
                />
              </li>
            )
          })}
          {restoUser === false 
          && showComments 
          && comments.map( comment => {
            return (
              <li key={Math.random()}>
                <Comment 
                  style={{backgroundColor: 'rgb(255, 255, 255)'}}
                  content={comment.text}
                  author={<span style={{fontStyle: 'bold', fontSize: '16px'}}>{comment.author}</span>}
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