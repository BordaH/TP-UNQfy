const express = require('express');    
const fs = require('fs');  
const bodyParser = require('body-parser');
const unqmod = require('./unqfy');
const errors = require('./modules/errors');
const artistmod = require('./modules/artist');

const app = express();          
const router = express.Router();
const port = process.env.PORT || 5000; 

function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);



router.route('/artists').post((req,res,next) => {  
  const unqfy = getUNQfy('unqfy.txt');
  if('name' in req.body && 'country' in req.body){
    try {
      unqfy.addArtist({name :req.body.name,country: req.body.country});
      saveUNQfy(unqfy,'unqfy.txt');
      res.json(unqfy.getArtistByName(req.body.name));  
    } catch (error) {
      if (error instanceof unqmod.ExceptionUNQfy)
        next(new errors.ResourceAlreadyExists());
    }
  }else{
    next(new errors.BadRequest());
  }
})
  .get((req,res) => {      
    const unqfy = getUNQfy('unqfy.txt');
    if(req.query.name)
      res.json(unqfy.searchArtistByName(req.query.name));
    else{
      res.json(unqfy.artists);
    }
  });

router.route('/artists/:id').get((req,res,next)=> {
  const unqfy = getUNQfy('unqfy.txt'); 
  try {
    res.json(unqfy.getArtistByID(parseInt( req.params.id)));
  } catch (error) {
    if (error instanceof unqmod.ExceptionUNQfy)
      next(new errors.ResourceNotFound());
    else {
      next(error);
    }
  }
})
  .delete((req,res,next)=> {  
    const unqfy = getUNQfy('unqfy.txt');
    try {
      unqfy.deleteArtistByID(parseInt( req.params.id));
    } catch (error) {
      if (error instanceof unqmod.ExceptionUNQfy){
        next(new errors.ResourceNotFound());
      }else{
        next(error);
      }
    }
    saveUNQfy(unqfy,'unqfy.txt');
    res.status(200);
    res.end();
  });
router.route('/videos').get((req,res,next) => {      
  const unqfy = getUNQfy('unqfy.txt');
  if(req.query.id){
    console.log(req.query.id);
    try{
      unqfy.getVideosForArtistByName(parseInt(req.query.id)).then(response=>res.json(response));
    }catch(error){
      if(error instanceof unqmod.ExceptionUNQfy){
        next(new errors.ResourceNotFound);
      }else{
        next(error);
      }
    }
  }else{
    next(new errors.BadRequest());
  }
});
router.route('/albums').post((req,res,next)=>{
  if('artistId' in req.body && 'name' in req.body && 'year' in req.body){
    const unqfy = getUNQfy('unqfy.txt');
    try {
      const artist = unqfy.getArtistByID(req.body.artistId);
      unqfy.addAlbum(artist.name,{name :req.body.name,year: req.body.year});
    } catch (error) {
      if (error instanceof artistmod.DuplicateAlbumException)
        next(new errors.ResourceAlreadyExists());
      if (error instanceof unqmod.ExceptionUNQfy)
        next(new errors.RelatedResourceNotFound());
    }
    saveUNQfy(unqfy,'unqfy.txt');
    res.json(unqfy.getAlbumByName(req.body.name));
  }else{
    next(new errors.BadRequest());
  }
})
  .get((req,res) => {      
    const unqfy = getUNQfy('unqfy.txt');
    if(req.query.name)
      res.json(unqfy.searchAlbumByName(req.query.name));
    else
      res.json(unqfy.getAllAlbums());
  });

router.route('/albums/:id').get((req,res,next)=>{
  const unqfy = getUNQfy('unqfy.txt');
  try {
    res.json(unqfy.getAlbumByID(parseInt(req.params.id)));
  } catch (error) {
    if (error instanceof unqmod.ExceptionUNQfy)
      next(new errors.ResourceNotFound());
    else
      next(error);  
  }
})
  .delete((req,res,next)=>{
    const unqfy = getUNQfy('unqfy.txt');
    try {
      unqfy.deleteAlbumByID(parseInt(req.params.id));
    } catch (error) {
      if(error instanceof unqmod.ExceptionUNQfy){
        next(new errors.ResourceNotFound());
      }
      else{
        next(error);
      }
    }
    saveUNQfy(unqfy,'unqfy.txt');
    res.status(200);
    res.end();
  });
app.all('*', (req, res, next) => {
  next(new errors.ResourceNotFound());
});
  
router.route('/').get((req, res) => {
  res.json({ message: 'APIRest unqfy' });
});


app.use(errors.errorHandler);
app.listen(port);