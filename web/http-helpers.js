var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'content-type': 'text/html'
};

exports.serveAssets = function(response, asset, callback) {
  fs.readFile(archive.paths.siteAssets + asset, 'utf8', function(error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

exports.send404 = function(response) {
  exports.sendResponse(response, '404: Page not found', 404);
};


exports.sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

exports.serveArchives = function(response, asset, callback) {
  fs.readFile(archive.paths.archivedSites + asset, 'utf8', function(error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

exports.sendResponse = function(response, data, statusCode, content) {
  statusCode = statusCode || 200;
  response.setHeader('content-type', content);
  response.writeHead(statusCode, exports.headers);
  response.write(data);
  response.end();
};

exports.collectData = function(request, callback) {
  let body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  });
  request.on('end', function() {
    body = Buffer.concat(body).toString().slice(4);
    callback(body);
  });
};

// exports.serveAssets = function(response, asset, callback) {
//   var encoding = {encoding: 'utf8'};
//   fs.readFile(archive.paths.siteAssets + asset, encoding, function(error, data) {
//     if (error) {
//       fs.readFile(archive.paths.archivedSites + asset, encoding, function(error, data) {
//         if (error) {
//           callback ? callback() : exports.send404(response);
//         } else {
//           exports.sendResponse(response, data);
//         }
//       });
//     } else {
//       exports.sendResponse(response, data);
//     }
//   });
// };


// exports.collectData = function(request, callback) {
//   var data = '';
//   request.on('data', function(chunk) {
//     data += chunk;
//   });
//   request.on('end', function() {
//     callback(data);
//   });
// };


  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)



// As you progress, keep thinking about what helper functions you can put here!
