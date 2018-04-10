/* eslint-env node, mocha */

const assert = require('chai').assert;
const libunqfy = require('./unqfy');


function createAndAddArtist(unqfy, artistName, country) {
  unqfy.addArtist({ name: artistName, country });
  const artist = unqfy.getArtistByName(artistName);
  return artist;
}

function createAndAddAlbum(unqfy, artistName, albumName, albumYear) {
  unqfy.addAlbum(artistName, { name: albumName, year: albumYear });
  return unqfy.getAlbumByName(albumName);
}

function createAndAddTrack(unqfy, albumName, trackName, trackDuraction, trackGenres) {
  unqfy.addTrack(albumName, { name: trackName, duration: trackDuraction, genres: trackGenres });
  return unqfy.getTrackByName(trackName);
}


describe('Add, remove and filter data', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
  });

  it('should add an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

    assert.equal(artist.name, 'Guns n\' Roses');
    assert.equal(artist.country, 'USA');
  });

  it('should add an album to an artist', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);

    assert.equal(album.name, 'Appetite for Destruction');
    assert.equal(album.year, 1987);
  });

  it('should add a track to an album', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const track = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock']);

    assert.equal(track.name, 'Welcome to the jungle');
    assert.strictEqual(track.duration, 200);
    assert.equal(track.genres.includes('rock'), true);
    assert.equal(track.genres.includes('hard rock'), true);
    assert.lengthOf(track.genres, 2);
  });

  it('should get all tracks matching genres', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const t0 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
    const t1 = createAndAddTrack(unqfy, 'Appetite for Destruction', "Sweet Child o' Mine", 500, ['rock', 'hard rock', 'pop', 'movie']);

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);
    const t2 = createAndAddTrack(unqfy, 'Thriller', 'Trhiller', 200, ['pop', 'movie']);
    createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, ['classic']);
    const t3 = createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, ['movie']);

    const tracksMatching = unqfy.getTracksMatchingGenres(['pop', 'movie']);

    // assert.equal(tracks.matching.constructor.name, Array);
    assert.isArray(tracksMatching);
    assert.lengthOf(tracksMatching, 4);
    assert.equal(tracksMatching.includes(t0), true);
    assert.equal(tracksMatching.includes(t1), true);
    assert.equal(tracksMatching.includes(t2), true);
    assert.equal(tracksMatching.includes(t3), true);
  });

  it('should get all tracks matching artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    const t2 = createAndAddTrack(unqfy, 'Appetite for Destruction', "It's so easy", 200, ['rock', 'hard rock']);
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Use Your Illusion I', 1992);
    const t3 = createAndAddTrack(unqfy, 'Use Your Illusion I', "Don't Cry", 500, ['rock', 'hard rock']);

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);
    createAndAddTrack(unqfy, 'Thriller', 'Thriller', 200, ['pop', 'movie']);
    createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, ['classic']);
    createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, ['movie']);

    const matchingTracks = unqfy.getTracksMatchingArtist(artist);

    assert.isArray(matchingTracks);
    assert.lengthOf(matchingTracks, 3);
    assert.isTrue(matchingTracks.includes(t1));
    assert.isTrue(matchingTracks.includes(t2));
    assert.isTrue(matchingTracks.includes(t3));
  });

  it.skip('loaded instance should  have the same data as the original one', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    unqfy.addPlaylist('my playlist', ['pop', 'rock'], 1400);

    unqfy.save('test.json');
    const loadedUnqfy = libunqfy.UNQfy.load('test.json');

    const artist = loadedUnqfy.getArtistByName('Guns n\' Roses');
    const album = loadedUnqfy.getAlbumByName('Appetite for Destruction');
    const track = loadedUnqfy.getTrackByName('Welcome to the jungle');

    assert.equal(artist.name, 'Guns n\' Roses');
    assert.equal(artist.country, 'USA');

    assert.equal(album.name, 'Appetite for Destruction');
    assert.equal(album.year, 1987);

    assert.equal(track.name, 'Welcome to the jungle');
    assert.equal(track.duration, 200);
    assert.equal(track.genres.includes('rock'), true);
    assert.equal(track.genres.includes('hard rock'), true);
    assert.equal(track.genres.length, 2);
    assert.equal(loadedUnqfy.getPlaylistByName('my playlist').name, 'my playlist');
  });
});

describe('Playlist Creation and properties', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
  });

  it('should create a playlist as requested', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
    createAndAddTrack(unqfy, 'Appetite for Destruction', "Sweet Child o' Mine", 1500, ['rock', 'hard rock', 'pop', 'movie']);

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);
    const t2 = createAndAddTrack(unqfy, 'Thriller', 'Thriller', 200, ['pop', 'movie']);
    const t3 = createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, ['pop']);
    const t4 = createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, ['pop']);

    unqfy.addPlaylist('my playlist', ['pop', 'rock'], 1400);
    const playlist = unqfy.getPlaylistByName('my playlist');

    assert.equal(playlist.name, 'my playlist');
    assert.isAtMost(playlist.duration(), 1400);
    assert.isTrue(playlist.hasTrack(t1));
    assert.isTrue(playlist.hasTrack(t2));
    assert.isTrue(playlist.hasTrack(t3));
    assert.isTrue(playlist.hasTrack(t4));
  });
});
