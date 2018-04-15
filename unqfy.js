const picklejs = require('picklejs');

class Playlist{
  constructor(_name,_genders,_maxDuration){
    this.name=_name;
    this.genres =[];
    this.tracks =[];
    this.duration = _maxDuration;
    this.addGenders(_genders);
  }

  addGenders(_genders){
   _genders.forEach(element=>{ this.genres.push(element);});
  }

  duration(){
    return this.duration;
  }
  hasTrack(){
    return this.tracks.some( album => album.name === _name);
  }
}

class Track {
  constructor(_name,_duration,_genres,_author){
    this.name = _name;
    this.duration = _duration;
    this.genres = [];
    this.author = _author;
    this.addGenders(_genres);
  }
  
  addGenders(_genders){
    _genders.forEach(element=>{ this.genres.push(element);});
  }

  hasGender(_genders){
    let res = false;
    _genders.forEach(element => {
      if(this.genres.includes(element)){
        res = true;
      }
    });
    return res;
  }
}

class Album {
  constructor(_name, _year,_author) {
    this.name = _name;
    this.year = _year;
    this.tracks = [];
    this.author = _author;
  }

  addTrack(_nameTrack){
    this.tracks.push(_nameTrack);
  }
}

class Artist {
  constructor(_name, _country) {
    this.name = _name;
    this.country = _country;
    this.albums = [];
  }

  addAlbum(params) {
    this.albums.push(params);
  }

  hasAlbum(_name) {
    return this.albums.some( album => album.name === _name);
  }

  getAlbums(){
    return this.albums;
  }
}


class UNQfy {

  constructor() {
    this.artists = [];
    this.tracks = [];
    this.albums = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    const res = [];
    this.tracks.forEach(element => {
      if(element.hasGender(genres)){
        res.push(element);
      }
    });
    return res;
  }

  getTracksMatchingArtist(artistName) {
    const res = [];
    this.tracks.forEach(element => {
       if(element.author===artistName.name){ res.push(element);}
    });
    return res;
  }
  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    this.artists.push(new Artist(params.name, params.country));
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    const author = this.getArtistByName(artistName);
    const album = new Album(params.name, params.year,author.name);
    author.addAlbum(album.name);
    this.albums.push(album);
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    const album = this.getAlbumByName(albumName);
    const track = new Track(params.name,params.duration,params.genres,album.author);
    this.tracks.push(track);
    album.addTrack(track.name);
  }

  getArtistByName(name) {
    return this.artists.find((artist) => {
      return artist.name === name;
    });
  }

  getAlbumByName(name) {
    return this.albums.find((album)=>{
      return album.name===name;
    });
  }

  getTrackByName(name) {
    return this.tracks.find((track)=>{
      return track.name===name;
    });
  }

  getPlaylistByName(name) {
    return this.playlists.find((playlist)=>{
      return playlist.name===name;
    });
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */
   const playlist = new Playlist(name,genresToInclude,maxDuration);
   this.playlists.push(playlist);

  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

