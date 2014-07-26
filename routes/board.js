var schema = require('../schema/exports.js')

var async = require("async")

var boardSchema = {};
boardSchema.sendStatus = function(req, res, next){
	if(req.params.count == "all"){
		var resArr = [];
		async.eachSeries(global._SERIALMAP, function(user, next){
			updateIndividualLights({count: user.name, bit: req.params.bit}, function(err, data){
				turnLightOnOff(user.name, req.params.bit);
				if(!err)
					resArr.push(data)
				console.log("data",data)
				next();
			})
		}, function(err){
			console.log("data1",resArr)
			res.end(JSON.stringify(returnStatus()));
			//res.send("data **************************");
		})
	}else{
		updateIndividualLights(req.params, function(err, data){
			turnLightOnOff(req.params.count, req.params.bit);
			if(!err)
				res.end(JSON.stringify(returnStatus()));
			else
				res.end({code: 400})
		})	
	}
}	

boardSchema.getStatus = function(req, res, next){
	res.end(JSON.stringify(returnStatus()));
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

boardSchema.admin = function(req, res, next){
	res.render("index", {title: "Admin"})
}

boardSchema.getUsageData = function(req, res, next){
	var count = 0
	schema.statsModel.aggregate(  
		    { $group: { _id: '$name', expense: { $sum: '$totalTime' }}}, // 'group' goes first!
		    function(err, summary) {
		    	async.eachSeries(summary, function(user, next){
		    		summary[count].username = getMapData(user._id)
		    		count++;
					next();
				}, function(err){
					console.log(summary)
					res.render('stats', {chartData: summary})
					//res.send("data **************************");
				})
		        
		    }
		);
	}

boardSchema.getRecords = function(req, res, next){
	console.log("insidee")
	var count = 0
	schema.statsModel.aggregate(  
		    { $group: { _id: '$name', expense: { $sum: '$totalTime' }}}, // 'group' goes first!
		    function(err, summary) {
		    	console.log("summary",summary)
		    	async.eachSeries(summary, function(user, next){
		    		summary[count].username = getMapData(user._id)
		    		count++;
					next();
				}, function(err){
					console.log(summary)
					res.json(summary)
					//res.send("data **************************");
				})
		        
		    }
		);
	}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}
function turnLightOnOff(count, bit){
	console.log('count, bit',count, bit);
	if(count == global._SERIALMAP[0].name && bit == 0)
		global._LED.off();
	if(count == global._SERIALMAP[0].name && bit == 1)
		global._LED.on();

	if(count == global._SERIALMAP[1].name && bit == 0)
		global._LED1.off();
	if(count == global._SERIALMAP[1].name && bit == 1)
		global._LED1.on();

	if(count == global._SERIALMAP[2].name && bit == 0)
		global._LED2.off();
	if(count == global._SERIALMAP[2].name && bit == 1)
		global._LED2.on();

}
function getMapData(id){
	if(global._SERIALMAP[0].name == id)
		return global._SERIALMAP[0].username;
	
	if(global._SERIALMAP[1].name == id)
		return global._SERIALMAP[1].username;
	
	if(global._SERIALMAP[2].name == id)
		return global._SERIALMAP[2].username;
	
}
function returnStatus()
{
  var json = {};

  json[global._SERIALMAP[0].name] = global._LED.isOn;
  json[global._SERIALMAP[1].name] = global._LED1.isOn;
  json[global._SERIALMAP[2].name] = global._LED2.isOn;  
  return json;
}

module.exports = boardSchema;

