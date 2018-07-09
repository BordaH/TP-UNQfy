class SubscriptionList {
  constructor(){
    this.list = {};
  }

  add(artistId,email){
    const subs = this.getSubscrptiors(artistId);
    if(!subs.includes(email)){
      subs.push(email);
    }
  }
  addSubscriber(artistId,email){
    if(Object.keys(this.list).includes(`${artistId}`)){
      this.add(artistId,email);
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