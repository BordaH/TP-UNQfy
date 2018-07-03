const rp = require('request-promise');

class NotificationsObserver {
  constructor(port){
    this.baseURI = `http://localhost:${port}/api/`;
  }

  getOptions(method,endPoint,body){
    return{
      method: method,
      uri: this.baseURI + endPoint,
      body: body,
      json: true
    };
  }

  update(artistId,artistName,albumName){
    const body = {
      artistId : artistId,
      subject: `Nuevo album para artista ${artistName}`,
      message: `Se ha agregado el album ${albumName} al artista ${artistName}`,
      form: 'UNQFY <UNQfy.notifications@gmail.com>'
    };
    rp(this.getOptions('POST','notify',body));
  }
}

module.exports = {
  NotificationsObserver,
};