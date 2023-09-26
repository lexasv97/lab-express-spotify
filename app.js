require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
console.log("CLIENT ID", process.env.CLIENT_ID)
console.log("CLIENT secret", process.env.CLIENT_SECRET)
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {

    //console.log("first get response")
    res.render("index.hbs")
})


app.get("/artist-search", (req, res) => {
    
    spotifyApi
      //.searchArtists(req.query)
      .searchArtists(req.query.artistName)
   .then(data => {
    //console.log("this is image object", data.body.artists.items[0].images)
      let result = data.body.artists.items
       res.render("artist-search-results.hbs", {result})

   })
   .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/albums/:albumId", (req,res,next) =>{
    spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then((data) => {
       // console.log("this is albums: ", data.body.items)
        let albumsResult = data.body.items
        res.render("albums.hbs", {albumsResult})
    })
    .catch(err => console.log('The error with albums: ', err));

})

// app.get("/tracks/:trackId", (req,res,next) =>{

//     let {trackId} = req.params
//     spotifyApi
//     .getAlbumTracks(trackId)
//     .then(data =>{
//        // console.log("this is tracks: ", data.body)

//        console.log("Tracks from api:", data.body.items)
//         let tracks = data.body.items
//         res.render("tracks.hbs", {tracks})
//     })

//     .catch(err => console.log('The error with albums: ', err));

// })

app.get('/tracks/:trackId', (req, res, next) => {

    let { trackId } = req.params

    spotifyApi
    .getAlbumTracks(trackId)
    .then((data) => {
        let tracks = data.body.items
        console.log("Tracks from api:", data.body.items)
        res.render('tracks.hbs', { tracks })
    })
    .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
  );

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

