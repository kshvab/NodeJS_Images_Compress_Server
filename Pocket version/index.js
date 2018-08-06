/** Dependencies */
const Jimp = require('jimp');
const fs = require('fs');
const _cliProgress = require('cli-progress');
const CronJob = require('cron').CronJob;
var mongoose = require('mongoose');


/** Local Dependencies */
var db = require ('./db');
var bdPicture = require('./model');
const config = require('./config');
const inputPath = config.inputPath;
const shedule = config.shedule;
const outputPath = config.outputPath;
const targetWidth = config.targetWidth;
const targetHeight = config.targetHeight;
const targetQuality = config.targetQuality;
const targetGreyscale = config.targetGreyscale;


/** Connect to Database */
db.connect(config.dbUrl);


/** Start server time */
const tStart = Date.now();

fMain ();
fMonitoring();

function fMonitoring(){
	
		var job = new CronJob({
  			cronTime: shedule,
  			onTick: function() {
				var tDuration = timeConversion(Date.now() - tStart);
				console.log('=====> CRON cycle: ' + tDuration);
				
				fMain ();

			},
  			start: false,
  			timeZone: 'Europe/Amsterdam'
		});
	
		job.start();
};


function fMain () {
	
	var arrDirPictures = fScanInputDir ();	
	
	bdPicture.find({}, function (err, docs) {
		var arrBdPictures = docs;
		

		
//		console.log(arrDirPictures);		//arr[str]
//		console.log(arrBdPictures);			//arr[obj]
		
		
		
		
		var arrToAdd = [];
		var arrToChange = [];
		
		for (var i = 0; i < arrDirPictures.length; i++) {
				
			let exist = false;
			let dbIndex = -1;
			for (var k = 0; k < arrBdPictures.length; k++) {
				if (arrDirPictures[i] == arrBdPictures[k].name){
					exist = true;
					dbIndex = k;
				};
			};
					
			//console.log(i + ' ' + arrDirPictures[i] + ', exist: ' + exist + ', dbIndex: ' + dbIndex);
			
			
			if (!(exist)){
				arrToAdd.push(arrDirPictures[i]);
				console.log('===> Adding new foto: ' + arrDirPictures[i]);
			}
			else {
				let inputStr = inputPath + '/' + arrDirPictures[i];
				let outputStr = outputPath + '/' + arrDirPictures[i];
				let fName = arrDirPictures[i];
		
				Jimp.read(inputStr, function (err, image) {
    				if (err) throw err;
					
					if ((!(image.bitmap.width == arrBdPictures[dbIndex].width)) || (!(image.bitmap.height == arrBdPictures[dbIndex].height))){
						arrToChange.push(fName);
						console.log('===> Changing old foto: ' + fName);
						
					};
					

				});
				

			};	
		};
		
		
		if (arrToAdd.length > 0){
			fFileProcessingNew (arrToAdd);
		}
		else console.log('===> There are no new fotos.');
		return;
	});
};


function addPicturesToDb(name, image){

	var newPicture = new bdPicture ({
		_id: new mongoose.Types.ObjectId(),
		name: name,
//		mime: image._originalMime,
		width: image.bitmap.width,
		height: image.bitmap.height,
//		data: image.bitmap.data
	});
	
	newPicture.save(function(err) {
		if (err) throw err;
	});
	
	return;
};
				

function changePictureInDb(name, image) {
	
	bdPicture.findOne({ 'name': name }, function (err, bdImage) {
		if (err) return handleError(err);
		bdImage.width = image.bitmap.width;
		bdImage.height = image.bitmap.height;
		bdImage.save();
	});
	return;
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
	return pictures;
};

function fFileProcessingOld (arr) {
	console.log("\n=====> Processing " + arr.length + ' OLD files and changing in Database started:\n');
	
	
	/*
							
						changePictureInDb(fName, image);
						
						
						image.resize(targetWidth, targetHeight)			// resize
    		     				.quality(targetQuality);				// set JPEG quality
			
						if (targetGreyscale) image.greyscale();			// set greyscale
    					image.write(outputStr);							// save	
	*/
	
};

function fFileProcessingNew (arr) {

	console.log('\n=====> Starting processing with configuration: ');
	console.log("==> inputPath: " + inputPath);
	console.log("==> outputPath: " + outputPath);	
	console.log("==> targetWidth: " + targetWidth);	
	console.log("==> targetHeight: " + targetHeight);	
	console.log("==> targetQuality: " + targetQuality);	
	console.log("==> targetGreyscale: " + targetGreyscale + '\n');
	console.log("\n=====> Processing " + arr.length + ' files and adding to Database started:\n');
	const procBar = new _cliProgress.Bar({stopOnComplete: true}, _cliProgress.Presets.shades_classic);
	procBar.start(arr.length, 0);
	
	let index=0;

	var celihProhodov = Math.trunc((arr.length)/100);
	var lastProhod = (arr.length)%100;
	console.log('Making File Groups: We have ' + celihProhodov + ' groups with 100 files and ' + lastProhod + ' in last group');
	
	let start = 0;
	let finish;
	let krug = celihProhodov;
	
	if (celihProhodov) {
		finish = 100;
	}
	else finish = lastProhod;
	
	prohod (krug, start, finish);
	
	function prohod (kr, st, fin) {
		console.log('\nKrug: ' + kr + " Start: " + st + " Finish: " + fin);
		krug--;
		for (var i = st; i < fin; i++) {
		
			let inputStr = inputPath + '/' + arr[i];
			let outputStr = outputPath + '/' + arr[i];
			let fName = arr[i];
			
			Jimp.read(inputStr, function (err, image) {
    			if (err) console.log(err);
				
				addPicturesToDb(fName, image);
				
    			image.resize(targetWidth, targetHeight)		// resize
    			     .quality(targetQuality);				// set JPEG quality
				
				if(targetGreyscale) image.greyscale();		// set greyscale
    			image.write(outputStr); 					// save	
				
				index++;
				procBar.update(index);
				
				if (index == (fin-1)){
					if (krug < 0){
						console.log('=====> krug < 0');
						return;
					};
					if (krug > 0) {
						start += 100;
						finish += 100;
						prohod (krug, start, finish);
					};
					if (!(krug)){
						start += 100;
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

