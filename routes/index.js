

var express = require('express');
var router = express.Router();
var fs = require('fs');
var FormData = require('form-data');
var FileReader = require('filereader');
var File = require('file');
var ipfsAPI = require('ipfs-api');
var multer  = require('multer');
var crypto=require('crypto');
var path=require('path');
const storage = multer.diskStorage({
  destination: './server/uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

var upload  = multer({ storage: storage });

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
 
// or connect with multiaddr
// var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
 
// or using options
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
 
// or specifying a specific API path
// var ipfs = ipfsAPI({host: '1.1.1.1', port: '80', 'api-path': '/ipfs/api/v0'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postFile', upload.any(),function(req, res, next) {
	console.log("Request is",req.file);
	if (req.files) {
    fileName = req.files[0].filename;
    console.log("filessss",fileName);
}
	 const reader = new FileReader();
 
      const buffer = fs.readFileSync('./server/uploads/'+req.files[0].filename);
      
        // const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
        // const buf = buffer.Buffer(reader.result) // Convert data into buffer
        ipfs.files.add(buffer, (err, result) => { // Upload buffer to IPFS
          if(err) {
            console.error(err)
            return
          }
          let url = `https://ipfs.io/ipfs/${result[0].hash}`
          console.log(`Url --> ${url}`)
   
        })
      
      res.send("Success");
});
  

module.exports = router;