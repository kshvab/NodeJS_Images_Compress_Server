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



/** Start server time */
const tStart = Date.now();


var arr = fScanInputDir ();
fFileProcessing (arr);



function fScanInputDir () {
	var files = fs.readdirSync(inputPath);
	
	function fFindPictures (fName){
		let ext3 = fName.substring(fName.length - 3);
		ext3 = ext3.toLowerCase();
		let ext4 = fName.substring(fName.length - 4);
		ext4 = ext4.toLowerCase();
		
		if	((ext3 == 'jpg') || (ext3 == 'png') || (ext4 == 'jpeg')){
			return true;
		}
		else return false;
	};
	
	var pictures = files.filter(fFindPictures);
	console.log('=====> I found ' + pictures.length + ' pictures.');
	return pictures;
};








function fFileProcessing (arr) {

	console.log('\n=====> Starting processing with configuration: ');
	console.log("==> inputPath: " + inputPath);
	console.log("==> outputPath: " + outputPath);	
	console.log("==> targetWidth: " + targetWidth);	
	console.log("==> targetHeight: " + targetHeight);	
	console.log("==> targetQuality: " + targetQuality);	
	console.log("==> targetGreyscale: " + targetGreyscale + '\n');
	console.log("\n=====> Processing " + arr.length + ' files started:\n');

	let krugSize = 2000;
	let index=0;

	var celihProhodov = Math.trunc((arr.length)/krugSize);
	var lastProhod = (arr.length)%krugSize;
	console.log('\n=====> File Groups: We have ' + celihProhodov + ' groups with ' + krugSize + ' files and ' + lastProhod + ' in last group');
	
	const procBar = new _cliProgress.Bar({stopOnComplete: true}, _cliProgress.Presets.shades_classic);
	procBar.start(arr.length, 0);
	
	
	
	let start = 0;
	let finish;
	let krug = celihProhodov;
	
	if (celihProhodov) {
		finish = krugSize;
	}
	else finish = lastProhod;
	
	prohod (krug, start, finish);
	

	
	function prohod (kr, st, fin) {
//		console.log('\nKrug: ' + kr + " Start: " + st + " Finish: " + fin + ' (' +(timeConversion(Date.now() - tStart)) + ')');
		krug--;
		for (var i = st; i < fin; i++) {
		
			let inputStr = inputPath + '/' + arr[i];
			let outputStr = outputPath + '/' + arr[i];
			let fName = arr[i];
			
			Jimp.read(inputStr, function (err, image) {
    			if (err) console.log(err);
//				console.log('\nFile: ' + fName);
    			image.resize(targetWidth, targetHeight)		// resize
    			     .quality(targetQuality);				// set JPEG quality
				
				if(targetGreyscale) image.greyscale();		// set greyscale
    			image.write(outputStr); 					// save	
				
				index++;
				procBar.update(index);
				
				if (index == (fin-1)){
					if (krug < 0){
						console.log('\n=====> The Mission completed!!!');
						return;
					};
					if (krug > 0) {
						start += krugSize;
						finish += krugSize;
						prohod (krug, start, finish);
					};
					if (!(krug)){
						start += krugSize;
						finish += lastProhod;
						prohod (krug, start, finish);
					};
				};
			});
		};
	};
	return;
};











function timeConversion(millisec) {

        var seconds = (millisec / 1000).toFixed(1);

        var minutes = (millisec / (1000 * 60)).toFixed(1);

        var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

        var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) {
            return seconds + " Sec";
        } else if (minutes < 60) {
            return minutes + " Min";
        } else if (hours < 24) {
            return hours + " Hrs";
        } else {
            return days + " Days"
        }
    };








