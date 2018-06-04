const rp = require('request-promise');

class SpotifyAPI {
  constructor() {
    this.authHeader ={
      Authorization: 'Bearer ' + 'BQD6JBaPAwrxher_lX3EoQ7rZ_eu45ckOo4yQYb0Hr9sr0hE0ufSFXVMo86jzv0sH9PvXlzAlLlzwdXIkM5s86vqsNvxuNRSRGIvsjxZhpkFRf559J22pIwhyA7bXoO4txEA_oCqbxcqXVepdS3HyG4NY_EkPRc6arxBxaywIv8V9dCOI4MMVw'
    };
    this.baseURI =  'https://api.spotify.com/v1/';
  }
  getOptions(endPoint, params) {
    return {
      url: this.baseURI + endPoint,
      headers: this.authHeader ,
      json: true,
      qs: params,
    };
  }
  getArtisSpotifyId(artistName) {
    const qs = {
      q: artistName,
      type: 'artist',
    };
    const options = this.getOptions('search', qs);
    return rp(options).then((response) => {
      return {
        artistName: artistName,
        artistId: response.artists.items[0].id,
        albums: undefined,
      };
    });
  }
  /**
  * 
  * 
  * @param {*} artistData {artistId: <spotifyId>,artistName:<nombreDeArtista>}
  */
  getArtistSpotifyAlbums(artistData) {
    const options = this.getOptions(`artists/${artistData.artistId}/albums`);
    return rp(options).then(response => {
      artistData.albums = response.items;
      return artistData;
    });
  }
}

module.exports = {
  SpotifyAPI,
};