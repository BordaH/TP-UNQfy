const observablemod = require('./observable');

class Artist extends observablemod.Observable{
  constructor(_name, _country,_id) {
    super();
    this.name = _name;
    this.country = _country;
    this.albums = [];
    this.id = _id;
  }

  addAlbum(album) {
    if(this.albums.some(a => a.name === album.name))
      throw new DuplicateAlbumException();
    else{
      this.albums.push(album);
      this.notifyAll({reason : 'ALBUM ADDED', albumName: album.name,artist: this});
    }
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
  deleteAlbumByID(id){
    const newList = this.albums.filter(a=>a.id!==id);
    this.albums =newList;
  }

  getAlbumsByName(list,name){
    this.albums.forEach(a=>{if(a.name.toUpperCase().includes(name.toUpperCase()))
    {list.push(a);}});
  }
}

class DuplicateAlbumException {
  constructor(){
    this.message = `Ya existe un album con el mismo nombre para el artista ${this.name}`;
  }
}

module.exports = {
  Artist,
  DuplicateAlbumException
};