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

  update(change){
    if(change.reason === 'ALBUM ADDED'){
      this.updateAlbumAdded(change.artist.id,change.artist.name,change.albumName);
    }
  }
  updateAlbumAdded(artistId,artistName,albumName){
    const body = {
      artistId : artistId,
      subject: `Nuevo album para artista ${artistName}`,
      message: `Se ha agregado el album ${albumName} al artista ${artistName}`,
      from: 'UNQFY <UNQfy.notifications@gmail.com>'
    };
    rp(this.getOptions('POST','notify',body));
  }
}

module.exports = {
  NotificationsObserver,
};