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

module.exports ={
  Playlist,
};