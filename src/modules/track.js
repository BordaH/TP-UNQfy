class Track {
  constructor(_name,_duration,_genre){
    this.name = _name;
    this.duration = _duration;
    this.genre = _genre;
    this.lyrics='';
  }
  
  getLyrics(){
    return this.lyrics;
  }

  addLyrics(_lyrics){
    this.lyrics =_lyrics;
  }
}
module.exports = {
  Track,
};