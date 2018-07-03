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
}
module.exports = {
  SubscriptionList,
};