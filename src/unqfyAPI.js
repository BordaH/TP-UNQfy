const express = require('express');    
const fs = require('fs');  
const bodyParser = require('body-parser');
const unqmod = require('./unqfy');

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

const unqfy = getUNQfy('unqfy.txt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);



router.route('/artists').post((req,res) => {  
  unqfy.addArtist({name :req.body.name,country: req.body.country});
  saveUNQfy(unqfy,'unqfy.txt');
  res.json(unqfy.getArtistByName(req.body.name));
});

router.route('/artists/:id').get((req,res)=> {
  res.json(unqfy.getArtistByID(parseInt( req.params.id)));
});

router.route('/').get((req, res) => {
  res.json({ message: 'APIRest unqfy' });
});



app.listen(port);