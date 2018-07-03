class SubscriptionList {
  constructor(){
    this.list = {};
  }

  addSubscriber(artistId,email){
    if(Object.keys(this.list).includes(`${artistId}`)){
      this.list[`${artistId}`].push(email);
      console.log(this.list);
    }else{
      this.list[artistId] = [email];
      console.log(`no habia una lista asi que creamos una ${JSON.stringify(this.list)}`);
    }
  }

  deleteSubscriber(artistId,email){
    if(this.list[`${artistId}`].includes(email)){
      this.list[`${artistId}`].filter((mail)=> mail === email);
      console.log(`fue eliminado`);
    }else{
      console.log('el chabon no estaba subscripto');
    }
  }
  deleteAllSubscriptors(artistId){
    if(Object.keys(this.list).includes(`${artistId}`)){
      this.list[`${artistId}`] = [];
    }
  }
  getSubscrptiors(artistId){
    return this.list[`${artistId}`];
  }
}
module.exports = {
  SubscriptionList,
};