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

let arr = fScanInputDir();
let Len = arr.length;
let n = 0;

const procBar = new _cliProgress.Bar({stopOnComplete: true}, _cliProgress.Presets.shades_classic);
procBar.start(arr.length, 0);

fLogic(n);


function fLogic(n){
	fPrepPicture(arr[n])
		.then(fNext)
		.catch(err => console.log(err));


};

function fNext(){
	if (n < Len-1) {
		n++;
		procBar.update(n+1);
		fLogic(n);
		return;
	}
	else {
		console.log('\n\n===========> Mission completed');
		return;
	};
};


function fPrepPicture(name){
	return new Promise(function(resolve, reject){
		let inputStr = inputPath + '/' + name;
		let outputStr = outputPath + '/' + name;
		Jimp.read(inputStr, function (err, image) {
			if (err){
			reject('Не вдалося прочитати фотку', err);
			}
			else {
				image.resize(targetWidth, targetHeight)		// resize
    		     .quality(targetQuality);				// set JPEG quality
			
				if(targetGreyscale) image.greyscale();
				image.write((outputStr), (err, success)=>{ err ? reject(err) :resolve('image resized and saved successfully\n'+success)});
			};
		});
	});
};
	

		
		
			
		




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
	console.log('\n=====> Starting processing with configuration: ');
	console.log("==> inputPath: " + inputPath);
	console.log("==> outputPath: " + outputPath);	
	console.log("==> targetWidth: " + targetWidth);	
	console.log("==> targetHeight: " + targetHeight);	
	console.log("==> targetQuality: " + targetQuality);	
	console.log("==> targetGreyscale: " + targetGreyscale + '\n');
	return pictures;
};









