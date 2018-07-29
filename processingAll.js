/** Dependencies */
var Jimp = require('jimp');
var fs = require('fs');
const _cliProgress = require('cli-progress');

/** Configure a server */
const config = require('./config');
const inputPath = config.inputPath;
const outputPath = config.outputPath;
const targetWidth = config.targetWidth;
const targetHeight = config.targetHeight;
const targetQuality = config.targetQuality;
const targetGreyscale = config.targetGreyscale;





var arr = fScanInputDir ();
fFileProcessing (arr);



function fScanInputDir () {
	var files = fs.readdirSync(inputPath);
	
	function fFindPictures (fName){
		if	((fName.substring(fName.length - 3) == 'jpg') ||
			(fName.substring(fName.length - 3) == 'png') ||
			(fName.substring(fName.length - 4) == 'jpeg')) {
			return true;
		}
		else return false;
	};
	
	var pictures = files.filter(fFindPictures);
	console.log('=====> I found ' + pictures.length + ' pictures.');
	return pictures;
};



function fFileProcessing (arr) {
	
	console.log('=====> Starting processing with configuration: ');
	console.log("==> inputPath: " + inputPath);
	console.log("==> outputPath: " + outputPath);	
	console.log("==> targetWidth: " + targetWidth);	
	console.log("==> targetHeight: " + targetHeight);	
	console.log("==> targetQuality: " + targetQuality);	
	console.log("==> targetGreyscale: " + targetGreyscale + '\n');
	
	const procBar = new _cliProgress.Bar({stopOnComplete: true}, _cliProgress.Presets.shades_classic);
	procBar.start(arr.length, 0);
	
	let index=0;

	for (var i = 0; i < arr.length; i++) {
		
		let inputStr = inputPath + '/' + arr[i];
		let outputStr = outputPath + '/' + arr[i];
		let fName = arr[i];

		Jimp.read(inputStr, function (err, image) {
    		if (err) throw err;
			
    		image.resize(targetWidth, targetHeight)		// resize
    		     .quality(targetQuality);				// set JPEG quality
			
			if(targetGreyscale) image.greyscale();		// set greyscale
    		image.write(outputStr); 					// save	
			
			index++;
			procBar.update(index);
			
		});
	};	
};
























