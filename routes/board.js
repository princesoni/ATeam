var schema = require('../schema/exports.js')
var five = require("johnny-five");
var async = require("async")
//var serie = "/dev/tty.usbmodemfa131";
//var board = new five.Board({ port: serie });

var boardSchema = {};
boardSchema.sendStatus = function(req, res, next){
	if(req.params.count == "all"){
		var resArr = [];
		async.eachSeries(global._SERIALMAP, function(user, next){
			updateIndividualLights({count: user.name, bit: req.params.bit}, function(err, data){
				if(!err)
					resArr.push(data)
				console.log("data",data)
				next();
			})
		}, function(err, data1){
			console.log("data1",resArr)
			res.send("data **************************");
		})
	}else{
		updateIndividualLights(req.params, function(err, data){
			if(!err)
				res.send(data);
			else
				res.send({code: 400})
		})	
	}
}	

boardSchema.getStatus = function(req, res, next){
	res.send("get status");
}

function updateIndividualLights(inputParams, callback){
	schema.statsModel.find({name: inputParams.count}, function(findErr, findData){
		if(!findErr && findData.length == 0 && inputParams.bit == 1){
			var stats = new schema.statsModel({
			    name: inputParams.count,
			    startTime: new Date(),
			    status: inputParams.bit,
			    presence: 1
		    });
			stats.save(function(err, statsData){
				callback(err, statsData);
				 //res.send(statsData);
			 });
		}else{
			schema.statsModel.findOne({name: inputParams.count}, {}, { sort: { 'created_at' : -1 } }, function (err, docs) {
				if(docs){
					if(inputParams.bit == 1 ){
						var stats = new schema.statsModel({
						    name: inputParams.count,
						    startTime: new Date(),
						    status: inputParams.bit,
						    presence: 1
					    });
						stats.save(function(err, statsData){
							callback(err, statsData);
						 });
					}else{
						docs.endTime = new Date();
						docs.status =  inputParams.bit;
						docs.presence = 0;
						docs.totalTime = getMinutesBetweenDates(docs.startTime, docs.endTime);
						docs.save(function (updateErr, updateDoc) {
							callback(updateErr, updateDoc);
						});
					}
				}else
					callback(err, docs)
			});
		}
	});
}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}
module.exports = boardSchema;

