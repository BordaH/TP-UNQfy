const rp = require('request-promise');
class YouTubeAPI{
  constructor() {
    this.baseURI =  'https://www.googleapis.com/youtube/v3/search';
  }

  getOptions(artistName){
    return {
      url: this.baseURI,
      headers: this.authHeader ,
      json: true,
      qs: {
        part: 'snippet',
        maxResults : 3,
        order : 'viewCount',
        q : artistName,
        items : 'items(id%2FvideoId%2Csnippet%2Ftitle)',
        key : 'AIzaSyBXZdc7cPSmqUBh4RgknEObrSwk1unzKc8'
      },
    };
  }

  searchVideosForArtist(artistName){
    return rp(this.getOptions(artistName))
      .then(res => {
        return res.items.map(element => {
          return this.mapSearchResultItem(element);
        });
      });
  }

  mapSearchResultItem(item){
    return {title : item.snippet.title,url: `https://youtube.com/watch?v=${item.id.videoId}`};
  }
}

module.exports = {
  YouTubeAPI,
};