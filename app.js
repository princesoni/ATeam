
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var mongoose = require('mongoose');
var app = express();
var mongoUrl = 'mongodb://127.0.0.1/Ateam';


app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());


// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());


//Global variables
global._MONGODB = mongoose.createConnection(mongoUrl);
global._SCHEMA = mongoose.Schema;

global._SERIALMAP = [{name: 5, port: "lokesh"},{name: 6, port: "nandani"},{name: 7, port: "sandeep"}]

var routes = require('./routes/exports')
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/sendStatus/:count/:bit', routes.board.sendStatus);
app.get('/getStatus', routes.board.getStatus);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
