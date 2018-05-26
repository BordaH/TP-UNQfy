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

module.exports = {
  Album,
};