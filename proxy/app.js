/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

// var express = require('express'); // Express web server framework
// var request = require('request'); // "Request" library
// var querystring = require('querystring');
// var cookieParser = require('cookie-parser');
//
// var client_id = 'CLIENT_ID'; // Your client id
// var client_secret = 'CLIENT_SECRET'; // Your secret
// var redirect_uri = 'REDIRECT_URI'; // Your redirect uri
//
// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function(length) {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//
//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };
//
// var stateKey = 'spotify_auth_state';
//
// var app = express();
//
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
//     next();
// };
//
// app.use(express.static(__dirname + '/public'))
//    .use(cookieParser())
//    .use(allowCrossDomain);
//
// app.get('/login', function(req, res) {
//
//   var state = generateRandomString(16);
//   res.cookie(stateKey, state);
//
//   // your application requests authorization
//   var scope = 'user-read-private user-read-email';
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });
//
// app.get('/artist', function(req, res){
//
//   console.log('req.query', req.query);
//
//   var options = {
//     url: 'https://api.spotify.com/v1/search?type=artist&q=' + req.query.q,
//     json: true
//   };
//
//   request.get(options, function(error, response, body){
//     if (!error && response.statusCode === 200) {
//
//       res.send(body);
//     }
//   });
//
// });
//
// console.log('Listening on 8888');
// app.listen(8888);

var express = require('express');
var request = require('request');

var app = express();
app.use('/', function(req, res) {
  var apiServerHost = 'https://api.spotify.com/v1';
  var url = apiServerHost + req.url;
  console.log('url', url);
  req.pipe(request(url)).pipe(res);
});

console.log('Listening on ' + 3000);
app.listen(3000);
