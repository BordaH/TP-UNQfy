const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

function toSeconds(argumento) {
  const args = argumento.split(':');
  return parseInt((args[0]) * 60) + parseInt(args[1]);
}

function main() {

  const unqfy = getUNQfy('unqfy.txt');
  const argumentos = process.argv.slice(2);

  switch (argumentos[0]) {
  case 'addTrack':
    unqfy.addTrack(argumentos[1], { name: argumentos[2], duration: toSeconds(argumentos[3]), genres: argumentos[4] });
    break;
  case 'addArtist':
    unqfy.addArtist({name: argumentos[1], country:argumentos[2]});
    break;
  case 'addAlbum':
    unqfy.addAlbum(argumentos[1], { name: argumentos[2], year: parseInt(argumentos[3])});
    break;
  case 'addPlaylist':
    unqfy.addPlaylist(argumentos[1], argumentos[2].split(','), parseInt(argumentos[3]));
    break;
  case 'getArtistByName':
    console.log(unqfy.getArtistByName(argumentos[1]));
    break;
  case 'getAlbumByName':
    console.log(unqfy.getAlbumByName(argumentos[1]));
    break;
  case 'getTrackByName':
    console.log(unqfy.getTrackByName(argumentos[1]));
    break;
  case 'getTracksMatchingArtist':
    console.log(unqfy.getTracksMatchingArtist(argumentos[1]));
    break;
  case 'getTracksMatchingGenres':
    console.log(unqfy.getTracksMatchingGenres(argumentos[1]));
    break;
  case 'getPlaylistByName':
    console.log(unqfy.getPlaylistByName(argumentos[1]));
    break;
  case 'testSpotify':
    unqfy.populateAlbumsForArtist('Queen').then(responseUNQfy => saveUNQfy(responseUNQfy,'unqfy.txt'));
    break;
  case 'testMusixMatch':
    unqfy.getLyrics('Got U Slippin').then(responseUNQfy => saveUNQfy(responseUNQfy,'unqfy.txt'));
    break;  
  default:
    console.log('Sorry, that is not something I know how to do.');
  }
  saveUNQfy(unqfy,'unqfy.txt');
}
main();


