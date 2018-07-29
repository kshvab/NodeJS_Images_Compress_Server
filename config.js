var Jimp = require('jimp');

var config = {
	
	//dbUrl: "",	//cloud
	dbUrl: "mongodb://localhost:27017/mongoose_basics",	//local
	
	targetWidth: 200,					
	targetHeight: Jimp.AUTO,			// Jimp.AUTO
	targetQuality: 60,					// set JPEG quality
    targetGreyscale: true,
	inputPath: "./input",
	outputPath: "./output",
	
	shedule: "* * * * *"				//
};

module.exports = config;




	
 /*	
 	Shedule settings /How to?/
 
 	 * "00 30 11 * * 1-5"
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     
	 * "01 00 00 * * 1"
	 * Runs every Monday only at 00:00:01 AM
	 
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11
    Day of Week: 0-6

*/

