/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    five = require("johnny-five");

var mongoose = require('mongoose');
var app = express();
var mongoUrl = 'mongodb://127.0.0.1/Ateam';


app.set('port', process.env.PORT || 3000);
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


//Global variables
global._MONGODB = mongoose.createConnection(mongoUrl);
global._SCHEMA = mongoose.Schema;
global._BOARD = new five.Board({
    port: "/dev/tty.usbmodemfa131"
});

// Board code ends
global._SERIALMAP = [{
    name: 9,
    port: "lokesh"
}, {
    name: 10,
    port: "nandani"
}, {
    name: 11,
    port: "sandeep"
}]


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}



// Board code starts
global._BOARD.on("ready", function () {
    motion = new five.IR.Motion(7);
    global._LED = new five.Led(global._SERIALMAP[0].name);
    global._LED1 = new five.Led(global._SERIALMAP[1].name);
    global._LED2 = new five.Led(global._SERIALMAP[2].name);
    var routes = require('./routes/exports');
    app.get('/sendStatus/:count/:bit', routes.board.sendStatus);
	app.get('/getStatus', routes.board.getStatus);

    //led3 = new five.Led(3);

    // this.repl.inject({
    //     motion: motion
    // });
    // // "calibrated" occurs once, at the beginning of a session,
    // motion.on("calibrated", function (err, ts) {
    //     console.log("calibrated", ts);
    // });
    // // "motionstart" events are fired when the "calibrated"
    // // proximal area is disrupted, generally by some form of movement
    // motion.on("motionstart", function (err, ts) {
    //     console.log("motionstart", ts);
    //     led.on();
    //     led1.on();
    //     led2.on();
    // });
    // // "motionstart" events are fired following a "motionstart event
    // // when no movement has occurred in X ms
    // motion.on("motionend", function (err, ts) {
    //     console.log("motionend", ts);
    //     led.off();
    //     led1.off();
    //     led2.off();
    // });


    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

});
