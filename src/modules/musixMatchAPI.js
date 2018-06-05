const rp = require('request-promise');

class MusixMatchAPI {
  constructor() {
    this.apikey = '7ab213372c050ee9af2edf49abe86257';
  }
  getTrackMusixMatchId(trackName) {
    const qs = {
      apikey: this.apikey,
      q_track: trackName,
    };
    const options = this.getOptionsMusixMatch('http://api.musixmatch.com/ws/1.1/track.search',qs);
    return rp(options).then((response) => {
      console.log(response);
      return {
        track_name: trackName,
        track_id: response.message.body.track_list[0].track.track_id,
        lyrics: undefined,
      };
    });
  }
  getOptionsMusixMatch(endpoint,params) {
    return {
      url: endpoint,
      json: true,
      qs: params,
    };
  }

  getLyricsMusixMatch(trackData) {
    const qs = {
      apikey: this.apikey,
      track_id: trackData.track_id,
    };
    const options = this.getOptionsMusixMatch('http://api.musixmatch.com/ws/1.1/track.lyrics.get',qs);
    return rp(options).then(response => {
      trackData.lyrics = response.message.body.lyrics.lyrics_body;
      return trackData;
    });
  }
}
module.exports = {
    MusixMatchAPI,
};