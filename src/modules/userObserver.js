const rp = require('request-promise');

class NotificationsObserver {
  constructor(port){
    this.baseURI = `localhost:${port}/api/`;
  }

  getOptions(method,endPoint,body){
    return{
      method: method,
      uri: this.baseURI + endPoint,
      body: body,
      json: true
    };
  }

  update(artistId,artistName,album){
    const body = {
      artistId : artistId,
      subject: `Nuevo album para artista ${artistName}`,
      message: `Se ha agregado el album ${album} al artista ${artistName}`,
      form: 'UNQFY <UNQfy.notifications@gmail.com>'
    };
    console.log(body);
    //rp(this.getOptions('POST','notify',body));
  }
}

const observer = new NotificationsObserver('8080');
observer.update(12,'Luca', 'Album de luca');