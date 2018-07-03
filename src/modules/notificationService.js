const express = require('express');    
const fs = require('fs');  
const bodyParser = require('body-parser');
const rp = require('request-promise');

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


router.route('/subscribe').post((req,res)=> {
  const options = {
    uri: `http://localhost:5000/api/artists/${req.body.artistId}`,
    json: true
  };
  rp(options).
    then(()=> {
      subscriptionsList.addSubscriber(parseInt(req.body.artistId),req.body.email);
      res.json(subscriptionsList);
    });
});

router.route('/unsubscribe').post((req,res)=> {
  const options = {
    uri: `http://localhost:5000/api/artists/${req.body.artistId}`,
    json: true
  };
  rp(options).
    then(()=> {
      subscriptionsList.deleteSubscriber(parseInt(req.body.artistId),req.body.email);
      res.json(subscriptionsList);
    });
});

router.route('/subscriptions')
  .get((req,res)=>{
    const options = {
      uri: `http://localhost:5000/api/artists/${req.query.artistId}`,
      json: true
    };
    rp(options).
      then(()=> {
        const response = {
          artistId : req.query.artistId,
          subscriptors : subscriptionsList.getSubscrptiors(req.query.artistId)
        };
        res.json(response);
      });
  })
  .delete((req,res) => {
    const options = {
      uri: `http://localhost:5000/api/artists/${req.body.artistId}`,
      json: true
    };
    rp(options).
      then(()=> {
        subscriptionsList.deleteAllSubscriptors(parseInt(req.body.artistId));
        res.json(subscriptionsList);
      });
  });

router.route('/notify').post((req,res)=> {
  const options = {
    uri: `http://localhost:5000/api/artists/${req.body.artistId}`,
    json: true
  };
  rp(options).
    then(()=> {
      const subscriptors = subscriptionsList.getSubscrptiors(parseInt(req.body.artistId));
      subscriptors.forEach((s) => mailSender.sendMail(s,req.body.subject,req.body.message,req.body.from));
      res.end();
    });
});

app.listen(port);
 