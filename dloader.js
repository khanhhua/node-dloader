var nimble = require('nimble'),
    req = require('request'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');

function download(urls, output_dir, callback) {
  if (typeof output_dir==='undefined')
    output_dir = './downloads';
  
  console.log('Output directory: ', output_dir);

  if (Array.isArray(urls)) {
    // Returns a list of successfully downloaded Urls
    nimble.map(urls, function(url, done){
      single_download(url, function(error, result){
        // result:: {filename, data}
        console.log(url, ' is downloaded.');
        var fullpath = path.join(output_dir, result.filename);

        save_to_local(fullpath, result.data, function(error, result) {
          if (error) {
            return console.error(error);
          }

          done(null, fullpath);
        });
      });
    }, function(error, result) {
      if (error)
        return callback(error, null);

      callback(null, result);
    });
  }
}

function single_download(single_url, callback) {
  req(single_url, function(error, response, body){
    if (error) {
      return callback(error,null);
    } else if (response.statusCode !== 200) {
      return callback(new Error('Invalid response code. Only HTTP-200 is acceptable'), null);
    }
    // extract the URL for the last path component and use it as the fault filename
    // URL must be valid so that pathname always starts with a SLASH ('/')
    var pathname = url.parse(single_url).pathname;
    if (pathname.lastIndexOf('/')===pathname.length-1)
      var filename = pathname.substring(1,pathname.length-1).replace(/\//g,'-');
    else
      var filename = pathname.slice(pathname.lastIndexOf('/') + 1);

    // console.dir(Object.keys(response));
    // console.log('RESPONSE TYPE: ' + (typeof body));
    callback(null, {filename:filename, data:response.body});
  });
}

function save_to_local(fullpath, data, callback){
  console.log('Type: ', typeof data);
  var dir = path.dirname(fullpath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  };

  fs.open(fullpath,'w',
      function(error, fd){
        if (error) {
          console.error('Error while saving', error);
          return callback(error, null);
        }
        var buffer = new Buffer(data, 'binary');
        fs.writeSync(fd, buffer, 0, buffer.length, 0);
        // Return the path to file
        callback(null, fullpath);
      });
}

exports.download = download;