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
        if (error) {
          console.error('Bad request', error);
          return done(null, 'BAD: ' + url);
        }
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
  var stream = req(single_url);
  var buffer = null;
  
  stream.on('error', function(error) {
    callback(error);
  });

  stream.on('data', function(data) {
      if (!buffer) {
        buffer = new Buffer(data.length);
        data.copy(buffer);
      } else {
        buffer = Buffer.concat([buffer, data]);
      }
      console.log(single_url, '[' + buffer.length + ' bytes] downloaded...');
  });
  stream.on('end', function(){
      var pathname = url.parse(single_url).pathname;
      
      if (pathname.lastIndexOf('/')===pathname.length-1)
        var filename = pathname.substring(1,pathname.length-1).replace(/\//g,'-');
      else
        var filename = pathname.slice(pathname.lastIndexOf('/') + 1);

      console.log(single_url, 'completed');
      callback(null, {filename:filename, data:buffer});
  });
}

function save_to_local(fullpath, data, callback){
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