const picklejs = require('picklejs');

class Track {
  constructor(_name,_duration,_genres){
    this.name = _name;
    this.duration = _duration;
    this.genres = [];
    this.addGenero(_genres);
  }

  addGenero(_genres){
    _genres.forEach(element => {
      this.genres.push(element);
    });
  }
}

class Album {
  constructor(_name, _year) {
    this.name = _name;
    this.year = _year;
    this.tracks = [];
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
}


class UNQfy {

  constructor() {
    this.artists = [];
    this.tracks = [];
    this.albums = [];
  }
  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres

  }

  getTracksMatchingArtist(artistName) {

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
    const album = new Album(params.name, params.year);
    const author = this.getArtistByName(artistName);
    author.addAlbum(album.name);
    this.albums.push(album);
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    const track = new Track(params.name,params.duration,params.genres);
    const album = this.getAlbumByName(albumName);
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

  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

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

