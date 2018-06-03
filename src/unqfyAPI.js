const express = require('express');    
const fs = require('fs');  
const bodyParser = require('body-parser');
const unqmod = require('./unqfy');
const errors = require('./modules/errors');

const app = express();          
const router = express.Router();
const port = process.env.PORT || 8080; 

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



router.route('/artists').post((req,res) => {  
  const unqfy = getUNQfy('unqfy.txt');
  unqfy.addArtist({name :req.body.name,country: req.body.country});
  saveUNQfy(unqfy,'unqfy.txt');
  res.json(unqfy.getArtistByName(req.body.name));
})
  .get((req,res) => {      
    const unqfy = getUNQfy('unqfy.txt');
    if(req.query.name)
      res.json(unqfy.searchArtistByName(req.query.name));
  });

router.route('/artists/:id').get((req,res,next)=> {
  const unqfy = getUNQfy('unqfy.txt');
  try {
    res.json(unqfy.getArtistByID(parseInt( req.params.id)));
  } catch (error) {
    if (error.message.includes('no artist'))
      next(new errors.ResourceNotFound());
    else
      next(error);
  }
})
  .delete((req,res)=> {  
    const unqfy = getUNQfy('unqfy.txt');
    unqfy.deleteArtistByID(parseInt( req.params.id));
    saveUNQfy(unqfy,'unqfy.txt');
    res.status(200);
    res.end();
  });
router.route('/albums').post((req,res)=>{
  const unqfy = getUNQfy('unqfy.txt');
  const artist = unqfy.getArtistByID(req.body.artistId);
  unqfy.addAlbum(artist.name,{name :req.body.name,year: req.body.year});
  saveUNQfy(unqfy,'unqfy.txt');
  res.json(unqfy.getAlbumByName(req.body.name));
})
  .get((req,res) => {      
    const unqfy = getUNQfy('unqfy.txt');
    if(req.query.name)
      res.json(unqfy.searchAlbumByName(req.query.name));
  });

router.route('/albums/:id').get((req,res)=>{
  const unqfy = getUNQfy('unqfy.txt');
  res.json(unqfy.getAlbumByID(parseInt(req.params.id)));
})
  .delete((req,res)=>{
    const unqfy = getUNQfy('unqfy.txt');
    unqfy.deleteAlbumByID(parseInt(req.params.id));
    saveUNQfy(unqfy,'unqfy.txt');
    res.status(200);
    res.end();
  });

router.route('/').get((req, res) => {
  res.json({ message: 'APIRest unqfy' });
});


app.use(errors.errorHandler);
app.listen(port);