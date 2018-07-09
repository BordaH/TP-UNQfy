const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');

const errors = require('./errors');
const listmod = require('./subscriptionsList');
const mailmod = require('./mailSender');

const app = express();          
const router = express.Router();
const port = process.env.PORT || 8080;

const subscriptionsList = new listmod.SubscriptionList();
const mailSender = new mailmod.MailSender();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

function relatedResourceErrorHandler(error,next){
  //console.log(error);
  error.error.errorCode === 'RESOURCE_NOT_FOUND' ? next(new errors.RelatedResourceNotFound()) : next(error);
}

function checkArtistOptions(id){
  return {
   // uri: `http://localhost:5000/api/artists/${id}`,
    uri: `http://172.20.0.21:5000/api/artists/${id}`,
    json: true
  };
}

function validateJSON(json,expected,next){
  if(!Object.keys(json).every((k) => expected.includes(k))){
    next(new errors.BadRequest());
  }
}

router.route('/subscribe').post((req,res,next)=> {
  validateJSON(req.body,['artistId','email'],next);
  rp(checkArtistOptions(req.body.artistId)).
    then(()=> {
      subscriptionsList.addSubscriber(parseInt(req.body.artistId),req.body.email);
      res.json(subscriptionsList);
    })
    .catch((error) => relatedResourceErrorHandler(error,next));
});
router.route('/unsubscribe').post((req,res,next)=> {
  rp(checkArtistOptions(req.body.artistId)).
    then(()=> {
      subscriptionsList.deleteSubscriber(parseInt(req.body.artistId),req.body.email);
      res.json(subscriptionsList);
    })
    .catch(error => relatedResourceErrorHandler(error,next));
});

router.route('/subscriptions')
  .get((req,res,next)=>{
    rp(checkArtistOptions(req.query.artistId)).
      then(()=> {
        const response = {
          artistId : req.query.artistId,
          subscriptors : subscriptionsList.getSubscrptiors(req.query.artistId)
        };
        res.json(response);
      }).catch(error => relatedResourceErrorHandler(error,next));
  })
  .delete((req,res,next) => {
    const options = {
      uri: `http://localhost:5000/api/artists/${req.body.artistId}`,
      json: true
    };
    rp(options).
      then(()=> {
        subscriptionsList.deleteAllSubscriptors(parseInt(req.body.artistId));
        res.json(subscriptionsList);
      }).catch(error => relatedResourceErrorHandler(error,next));
  });

router.route('/notify').post((req,res,next)=> {

  rp(checkArtistOptions(req.body.artistId)).
    then(()=> {
      const subscriptors = subscriptionsList.getSubscrptiors(parseInt(req.body.artistId)) || [];
      subscriptors.forEach((s) => mailSender.sendMail(s,req.body.subject,req.body.message,req.body.from));
      res.end();
    }).catch(error => relatedResourceErrorHandler(error,next));
});

app.all('*', (req, res, next) => {
  next(new errors.ResourceNotFound());
});

app.use(errors.errorHandler);

app.listen(port);
 