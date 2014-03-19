if (process.argv.length < 3) {
  console.info('USAGE: node main.js FULLY_QUALIFIED_URL[ FULLY_QUALIFIED_URL*]');
  return;
}

var dloader = require('./dloader');
var urls = process.argv.slice(2);
var result = dloader.download(urls, './downloads', function(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  console.log('All is done. See files in folder: ');
  result.forEach(function(ele,index){
    console.log((index + 1) + ' - ' + ele);
  });
});