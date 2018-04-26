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
    return this.tracks.some( (track) => track.name.toUpperCase() === _track.name.toUpperCase());
  }
}

class Track {
  constructor(_name,_duration,_genre){
    this.name = _name;
    this.duration = _duration;
    this.genre = _genre;
  }
}

class Album {
  constructor(_name, _year) {
    this.name = _name;
    this.year = _year;
    this.tracks = [];
  }

  addTrack(track){
    this.tracks.push(track);
  }

  getTrackByName(_name){
    return this.tracks.find(track => track.name.toUpperCase() === _name.toUpperCase());
  }
  getTracks(){
    return this.tracks;
  }
}

class Artist {
  constructor(_name, _country) {
    this.name = _name;
    this.country = _country;
    this.albums = [];
  }

  addAlbum(album) {
    this.albums.push(album);
  }

  hasAlbum(_name) {
    return this.albums.some( album => album.name.toUpperCase() === _name.toUpperCase());
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

  getTracks(){
    let res = [];
    for (let index = 0; index < this.albums.length; index++) {
      res = res.concat(this.albums[index].getTracks());
    }
    return res;
  }
}


class UNQfy {

  constructor() {
    this.artists = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres){
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    const res = [];
    this.getTracks().forEach(element => {
      if(genres.includes(element.genre)){
        res.push(element);
      }
    });
    return res;
  }

  getTracks(){
    let res = this.artists[0].getTracks();
    for (let index = 1; index < this.artists.length; index++) {
      res = res.concat(this.artists[index].getTracks());
    }
    return res;
  }

  getTracksMatchingArtist(artistName) {
    return this.getArtistByName(artistName.name).getTracks();
  }
  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    this.artists.push(new Artist(params.name, params.country));
    console.log('The artist was added correctly');
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    const author = this.getArtistByName(artistName);
    if(author!==undefined){
      const album = new Album(params.name, params.year);
      author.addAlbum(album);
      console.log(`The album was added correctly:${album.name}`);
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
      const track = new Track(params.name,params.duration,params.genres);
      album.addTrack(track);
      console.log(`The song was added correctly:${track.name}`);
    }else{
      throw new ExceptionUNQfy('You can not add the track since the album ' + albumName + 'does not exist.');
    }
  }

  getArtistByName(name) {
    const artist = this.artists.find((artist) => {
      return artist.name.toUpperCase() === name.toUpperCase();
    });
    if(artist !==undefined){
      return artist;
    }else{
      throw new ExceptionUNQfy('There is no named artist ' + name);
    }
  }

  getAlbumByName(name) {
    let album = undefined;
    for (let index = 0; index < this.artists.length && album===undefined; index++) {
      album = this.artists[index].getAlbumByName(name);
    }
    if(album !==undefined){
      return album;
    }else{
      throw new ExceptionUNQfy('There is no named album ' + name);
    }
  }

  getTrackByName(name) {
    let track = undefined;
    for (let index = 0; (index < this.artists.length && track===undefined); index++) {
      track = this.artists[index].getTrackByName(name);
    }
    if(track !==undefined){
      return track;
    }else{
      throw new ExceptionUNQfy(`There is no named track ${name}`);
    }
  }

  getPlaylistByName(name) {
    const playlist =  this.playlists.find((playlist)=>{return playlist.name.toUpperCase()===name.toUpperCase();});
    if(playlist !==undefined){
      return playlist;
    }else{
      throw new ExceptionUNQfy('There is no named playlist ' + name);
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
    console.log('The playlist was added correctly');
  }

  canAddTrackTo(playlist){
    return  this.areTracksLeftFor(playlist);
  }

  isValidTrack(track,playlist){
    return !playlist.hasTrack(track)&& track.duration <= playlist.durationLeft();
  }
  trackToBeAdded(playlist){
    return this.getTracksMatchingGenres(playlist.genres).find((track) => playlist.genres.includes(track.genre) && this.isValidTrack(track,playlist));
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

class ExceptionUNQfy {
  constructor(message) {
    this.message = message;
    this.name = 'ExceptionUNQfy';
  }
}

