const picklejs = require('picklejs');
const rp = require('request-promise');
const modArtist = require('./modules/artist');
const modPlaylist = require('./modules/playlist');
const modTrack = require('./modules/track');
const modAlbum = require('./modules/album');
const spotifymod = require('./modules/spotifyAPI');
const musixMatchMod = require('./modules/musixMatchAPI');
const observermod = require('./modules/userObserver');

const spotifyAPI = new spotifymod.SpotifyAPI();
const musixMatchAPI = new musixMatchMod.MusixMatchAPI();
class UNQfy {

  constructor() {
    this.nextID = 1;
    this.artists = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    const res = [];
    this.getTracks().forEach(element => {
      if (genres.includes(element.genre)) {
        res.push(element);
      }
    });
    return res;
  }

  getTracks() {
    let res = this.artists[0].getTracks();
    for (let index = 1; index < this.artists.length; index++) {
      res = res.concat(this.artists[index].getTracks());
    }
    return res;
  }

  getTracksMatchingArtist(artistName) {
    return this.getArtistByName(artistName.name).getTracks();
  }

  searchArtistByName(name) {
    return this.artists.filter(a => a.name.toUpperCase().includes(name.toUpperCase()));
  }

  searchAlbumByName(name) {
    const list = [];
    this.artists.forEach(a => a.getAlbumsByName(list, name));
    return list;
  }
  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    if (!this.artists.some(a => a.name === params.name)) {
      this.artists.push(new modArtist.Artist(params.name, params.country, this.nextID++));
      console.log('The artist was added correctly');
    }
    else
      throw new ExceptionUNQfy('The artist already exists');
  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    const author = this.getArtistByName(artistName);
    if (author !== undefined) {
      const album = new modAlbum.Album(params.name, params.year, this.nextID++);
      author.addAlbum(album);
      console.log(`The album was added correctly: ${album.name}`);
    } else {
      throw new ExceptionUNQfy('You can not add the album since the artist ' + artistName + ' does not exist');
    }
  }

  /* Debe soportar (al menos) :
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    const album = this.getAlbumByName(albumName);
    if (album !== undefined) {
      const track = new modTrack.Track(params.name, params.duration, params.genres);
      album.addTrack(track);
      console.log(`The song was added correctly:${track.name}`);
    } else {
      throw new ExceptionUNQfy('You can not add the track since the album ' + albumName + 'does not exist.');
    }
  }

  getArtistByName(name) {
    const artist = this.artists.find((artist) => {
      return artist.name.toUpperCase() === name.toUpperCase();
    });
    if (artist !== undefined) {
      return artist;
    } else {
      throw new ExceptionUNQfy('There is no named artist ' + name);
    }
  }

  getAlbumByID(id) {
    const artist = this.artists.find(a => a.hasAlbumByID(id));

    if (artist !== undefined) {
      return artist.getAlbumByID(id);
    } else {
      throw new ExceptionUNQfy('There is no album with id: ' + id);
    }
  }

  getArtistByID(id) {
    const artist = this.artists.find((artist) => {
      return artist.id === id;
    });
    if (artist !== undefined) {
      return artist;
    } else {
      throw new ExceptionUNQfy('There is no artist with id: ' + id);
    }
  }

  deleteArtistByID(id) {
    const newList = this.artists.filter(artist => artist.id !== id);
    if(this.artists.length !== newList.length){
      this.artists = newList;
    }else{
      throw new ExceptionUNQfy(`There is no artist with id : ${id}` );
    }
  }

  deleteAlbumByID(id) {
    const artist = this.artists.find(a => a.hasAlbumByID(id));
    if(artist !== undefined)
      artist.deleteAlbumByID(id);
    else
      throw new ExceptionUNQfy(`There is no album with id: ${id}`);
  }

  getAlbumByName(name) {
    let album = undefined;
    for (let index = 0; index < this.artists.length && album === undefined; index++) {
      album = this.artists[index].getAlbumByName(name);
    }
    if (album !== undefined) {
      return album;
    } else {
      throw new ExceptionUNQfy('There is no named album ' + name);
    }
  }

  getTrackByName(name) {
    let track = undefined;
    for (let index = 0; (index < this.artists.length && track === undefined); index++) {
      track = this.artists[index].getTrackByName(name);
    }
    if (track !== undefined) {
      return track;
    } else {
      throw new ExceptionUNQfy(`There is no named track ${name}`);
    }
  }

  getPlaylistByName(name) {
    const playlist = this.playlists.find((playlist) => { return playlist.name.toUpperCase() === name.toUpperCase(); });
    if (playlist !== undefined) {
      return playlist;
    } else {
      throw new ExceptionUNQfy('There is no named playlist ' + name);
    }
  }

  getAllAlbums(){
    let list = [];
    this.artists.forEach(a => {
      list = list.concat(a.getAlbums());
    });
    return list;
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */
    const playlist = new modPlaylist.Playlist(name, genresToInclude, maxDuration);
    while (this.canAddTrackTo(playlist)) {
      this.addTrackTo(playlist);
    }
    this.playlists.push(playlist);
    console.log('The playlist was added correctly');
  }

  canAddTrackTo(playlist) {
    return this.areTracksLeftFor(playlist);
  }

  isValidTrack(track, playlist) {
    return !playlist.hasTrack(track) && track.duration <= playlist.durationLeft();
  }
  trackToBeAdded(playlist) {
    return this.getTracksMatchingGenres(playlist.genres).find((track) => playlist.genres.includes(track.genre) && this.isValidTrack(track, playlist));
  }

  areTracksLeftFor(playlist) {
    return this.getTracksMatchingGenres(playlist.genres).some((track) => this.isValidTrack(track, playlist));
  }

  addTrackTo(playlist) {
    playlist.tracks.push(this.trackToBeAdded(playlist));
  }

  populateAlbumsForArtist(artistName) {
    return spotifyAPI.getArtisSpotifyId(artistName)
      .then(response => spotifyAPI.getArtistSpotifyAlbums(response))
      .then(response => this.addAlbumsToArtist(response.artistName, response.albums));
  }

  getLyrics(trackName) {
    const track = this.getTrackByName(trackName);
    if (track.getLyrics() === '') {
      return musixMatchAPI.getTrackMusixMatchId(trackName)
        .then(response => musixMatchAPI.getLyricsMusixMatch(response))
        .then(response => this.addLyricsToTrack(trackName, response.lyrics));
    } else {
      console.log(track.getLyrics());
      return new Promise((resolve, reject) => resolve(this));
    }
  }
  addLyricsToTrack(trackName, lyrics) {
    this.getTrackByName(trackName).addLyrics(lyrics);
    console.log(`Hemos agregado la letra para el track ${trackName}`);
    return this;
  }

  addAlbumsToArtist(artistName, albums) {
    const myArtist = this.getArtistByName(artistName);
    const mappedAlbums = albums.map(album => {
      const albumYear = album.release_date.split('-')[0];
      return new modAlbum.Album(album.name,albumYear,this.nextID++);
    });

    myArtist.addAlbums(mappedAlbums);
    console.log(`Hemos agregado ${mappedAlbums.length} albums para el artista ${artistName}`);
    // albums.forEach(album => this.addAlbum(artistName, { name: album.name, year: album.release_date.split('-')[0] }));
    return this;
  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, modArtist.Artist, modTrack.Track, modAlbum.Album, modPlaylist.Playlist,observermod.NotificationsObserver];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}
class ExceptionUNQfy {
  constructor(message) {
    this.message = message;
    this.name = 'ExceptionUNQfy';
  }
}
// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
  ExceptionUNQfy
};


