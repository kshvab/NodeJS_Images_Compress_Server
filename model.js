var mongoose = require('mongoose');

var bdPictureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: String,
//	mime: String,
	width: Number,
	height: Number,
//	data: String,
    created: { 
        	type: Date,
        	default: Date.now
    }
});

var bdPicture = mongoose.model('bdPicture', bdPictureSchema);


module.exports = bdPicture;