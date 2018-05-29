class Artist {
  constructor(_name, _country,_id) {
    this.name = _name;
    this.country = _country;
    this.albums = [];
    this.id = _id;
  }

  addAlbum(album) {
    this.albums.push(album);
  }
  addAlbums(albums){
    albums.forEach(album => this.addAlbum(album));
  }

  hasAlbum(_name) {
    return this.albums.some( album => album.name.toUpperCase() === _name.toUpperCase());
  }
  hasAlbumByID(_id) {
    return this.albums.some(album => album.id === _id);
  }

  getAlbums(){
    return this.albums;
  }
  getAlbumByName(_name){
    return this.albums.find(album => album.name.toUpperCase() === _name.toUpperCase());
  }
  getTrackByName(_name){
    let track = undefined;
    for (let index = 0; index < this.albums.length && track ===undefined; index++) {
      track = this.albums[index].getTrackByName(_name);
    }
    return track;
  }
  getAlbumByID(id){
    return this.albums.find(album => album.id === id);
  }

  getTracks(){
    let res = [];
    for (let index = 0; index < this.albums.length; index++) {
      res = res.concat(this.albums[index].getTracks());
    }
    return res;
  }
}

module.exports = {
  Artist,
};