var boardSchema = {};

boardSchema.sendStatus = function(req, res, next){
	res.send("send status");
}
module.exports = boardSchema;

