var boardSchema = {};

boardSchema.sendStatus = function(req, res, next){
	
	res.send("send status", req.params.count);
}

boardSchema.getStatus = function(req, res, next){
	res.send("get status");
}

module.exports = boardSchema;

