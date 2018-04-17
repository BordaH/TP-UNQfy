# TP-UNQfy

##Diagrama de clases

 ![Diagrama UML](./diagrama_uml.xml)
 

## Uso de CLI
  #### Agregar artistas
   Para agregar artistas puede usar el comando *addArtist*, el comando recibe nombre y pais del artista a añadir, se invoca de la siguiente manera:

    node main.js addArtist "Peter Tosh" "Jamaica"

  #### Agregar album
   Para agregar albums puede usar el comando *addAlbum*, el comando recibe el nombre del autor nombre y año del album a añadir, se invoca de la siguiente manera:
   
    node main.js addAlbum "Gun's and Roses" "Appetite for destruction" "1987"

  #### Agregar tracks
   Para agregar tracks puede usar el comando *addTrack*, el comando recibe nombre de album al que pertenece, nombre, duracion y genero del track a añadir, se invoca de la siguiente manera:
   
    node main.js addTrack "News Of The World" "We are the champions" "3:10" "rock"

  #### Agregar playlist
   Para crear una playlist puede usar el comando *addPlaylist*, el comando recibe nombre , generos que va a incluir y duracion maxima, se invoca de la siguiente manera:
   
    node main.js addPlaylist "Mi super playlist" ['rock','cumbia','reggae'] "1200"

  #### Agregar playlist
   Para crear una playlist puede usar el comando *addPlaylist*, el comando recibe nombre , generos que va a incluir y duracion maxima, se invoca de la siguiente manera:
   
    node main.js addPlaylist "Mi super playlist" ['rock','cumbia','reggae'] "1200"


  #### Visualizacion de resultados
  UNQfy permite visualizar tracks, albums, artistas y playlists. Para eso puede usar los comandos *getTrackByName*, *getAlbumByName*, *getArtistByName* y *getPlaylistByName*. Estos comandos tienen como unico parametro el nombre del objeto a visualizar.
    e.g.:  
   
    node main.js getArtistByName 'Queen'
    node main.js getPlaylistByName 'Mi Super Playlist'
    node main.js getTrackByName 'We are the champions'

### Busquedas 

  UNQfy permite realizar busquedas de tracks segun el artista que los interpreta y segun su genero con los comandos *getTracksMatchingArtist* que recibe el nombre del artista por el cual buscar y *getTracksMatchingGenres* que recibe una lista de genero por los cuales realizar la busqueda.

    node main.js getTracksMatchingArtist "Peter Tosh"
    node main.js getTracksMatchingGenres ['rock', 'reggae']