# NodeJS_Images_Compress_Server
### What does the program do?

* Monitoring new images and imagechanges in folder, compressing, saving new images to destination path. (From main business app to mobile app sales representatives).
* Preparation of photos of goods for use in accounting programs, thin clients, preparation for placing on the site of an online store.

> First You need to install the dependencies in the local node_modules folder (npm install)

Make changes to the configuration files you need.

A piece of code from the configuration file:
```javascript
var config = {
  dbUrl: "mongodb+srv://...",
  targetWidth: 150,					
  targetHeight: Jimp.AUTO,		
  targetQuality: 60,					// set JPEG quality
  targetGreyscale: false,
  inputPath: "./input",
  outputPath: "./output",
  shedule: "* * */6 * *"
}
```
## Enjoy!
