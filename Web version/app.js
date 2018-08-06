/** Dependencies */
var Jimp = require('jimp');
var fs = require('fs');

const config = require('./config');
const inputPath = config.inputPath;
const outputPath = config.outputPath;
const mainWidth = config.mainWidth;
const mainHeight = config.mainHeight;
const mainMiniWidth = config.mainMiniWidth;
const mainMiniHeight = config.mainMiniHeight;
const fonPath = config.fonPath;









let Arr = fScanInputDir();
let Len = Arr.length;
let n = 0;

fLogic(n);

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
	console.log('\n===========> I found ' + pictures.length + ' pictures.\n');
	return pictures;
};


function fLogic(n){
	fPrepPicture(Arr[n])
		.then(fComposite)
		.then(fNext)
		.catch(err => console.log(err));


};

function fNext(){
	if (n < Len-1) {
		n++;
		fLogic(n);
		return;
	}
	else {
		console.log('\n\n===========> Mission completed');
		return;
	};
};

function fPrepPicture(fileName){
	let path = inputPath + '/' + fileName;
	console.log((Len - n) + ' ==> Picture processing: ' + fileName);
	return new Promise(function(resolve, reject) {
		Jimp.read(path, function (err, img) {
			if (err)  reject('Не можу прочитати файл ', path, err);
			else{
				if ((img.bitmap.width > mainWidth) || (img.bitmap.height > mainHeight)) {
					img.scaleToFit(mainWidth, mainHeight);
				};
				if ((img.bitmap.width < mainWidth) && (img.bitmap.height < mainHeight)) {
					img.scaleToFit(mainMiniWidth, mainMiniHeight);
				};
				resolve([img, fileName]);
			};
		});
	});
};




function fComposite([pic, fileName]){
	return new Promise(function(resolve, reject){
		Jimp.read(fonPath, function (err, fon) {
			if (err)  console.log('Не можу прочитати ФОН ', err);
			else{
				let W = Math.floor((mainWidth - pic.bitmap.width)/2);
				let H = Math.floor((mainHeight - pic.bitmap.height)/2);
				fon.clone().composite(pic, W, H, function (error, res){
					if (error) reject('Не вдалося скласти фотки ', err);
					else {
						res.write((outputPath + '/' + fileName), (err, success)=>{ err ? reject(err) :resolve('image resized and saved successfully\n'+success)});
					}
				});
			}
		})
	});
};


