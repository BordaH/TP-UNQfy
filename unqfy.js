const picklejs = require('picklejs');

class Playlist{
  constructor(_name,_genres,_maxDuration){
    this.name=_name;
    this.genres  = _genres ;
    this.tracks =[];
    this.maxDuration = _maxDuration;
  }

  realDuration(){
    return this.tracks.map(t => t.duration).reduce((a, b) => a + b,0) ;
  }

  durationLeft(){
    return this.maxDuration - this.realDuration();
  }
  hasTrack(_track){
    return this.tracks.some( (track) => track.name === _track.name);
  }
}

class Track {
  constructor(_name,_duration,_genre,_author){
    this.name = _name;
    this.duration = _duration;
    this.genre = _genre;
    this.author = _author;
  }
}

class Album {
  constructor(_name, _year,_author) {
    this.name = _name;
    this.year = _year;
    this.tracks = [];
    this.author = _author;
  }

  addTrack(nameTrack){
    this.tracks.push(nameTrack);
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
      if(genres.includes(element.genre)){
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
    console.log("The artist was added correctly");
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    const author = this.getArtistByName(artistName);
    if(author!==undefined){
      const album = new Album(params.name, params.year,author.name);
      author.addAlbum(album.name);
      this.albums.push(album);
      console.log("The album was added correctly");
    }else{
      throw new ExceptionUNQfy('You can not add the album since the artist ' + artistName + ' does not exist');
    }
  }

  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    const album = this.getAlbumByName(albumName);
    if(album!==undefined){
      const track = new Track(params.name,params.duration,params.genres,album.author);
      this.tracks.push(track);
      album.addTrack(track.name);
      console.log("The song was added correctly");
    }else{
      throw new ExceptionUNQfy('You can not add the track since the album ' + albumName + 'does not exist.');
    }
  }

  getArtistByName(name) {
    const artist = this.artists.find((artist) => {
      return artist.name === name;
    });
    if(artist !==undefined){
      return artist;
    }else{
      throw new ExceptionUNQfy('There is no named artist ' + name);
    }
  }

  getAlbumByName(name) {
   const album = this.albums.find((album)=>{return album.name===name;});

    if(album !==undefined){
      return album;
    }else{
      throw new ExceptionUNQfy('There is no named album ' + name);
    }
  }

  getTrackByName(name) {
    const track =  this.tracks.find((track)=>{return track.name===name;});
    if(track !==undefined){
      return track;
    }else{
      throw new ExceptionUNQfy('There is no named track ' + name);
    }
  }

  getPlaylistByName(name) {
    const playlist =  this.playlists.find((playlist)=>{return playlist.name===name;});
    if(playlist !==undefined){
      return playlist;
    }else{
      throw new ExceptionUNQfy("There is no named playlist " + name);
    }
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */
    const playlist = new Playlist(name,genresToInclude,maxDuration);
    while(this.canAddTrackTo(playlist)){
      this.addTrackTo(playlist);
    }
    this.playlists.push(playlist);
  }

  canAddTrackTo(playlist){
    return  this.areTracksLeftFor(playlist);
  }

  isValidTrack(track,playlist){
    return !playlist.hasTrack(track)&& track.duration <= playlist.durationLeft();
  }
  trackToBeAdded(playlist){
    return this.tracks.find((track) => playlist.genres.includes(track.genre) && this.isValidTrack(track,playlist));
  }

  areTracksLeftFor(playlist){
    return this.getTracksMatchingGenres(playlist.genres).some((track) => this.isValidTrack(track,playlist));
  }

  addTrackTo(playlist){
    playlist.tracks.push(this.trackToBeAdded(playlist));
  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Track, Album, Playlist];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}
// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

function ExceptionUNQfy(message){
  this.message = message;
  this.name    = 'ExceptionUNQfy';
}
