
var statsSchema = new _SCHEMA({
    name: { type: String, required: true },
    startTime: { type: Date},
    endTime: { type: Date},
    totalTime: { type: Number},
    created_at: {type: Date, default: Date.now },
    status: { type: Number},
    presence: { type: Number}
});
exports.statsModel = _MONGODB.model('statsdata', statsSchema);
