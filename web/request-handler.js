var path = require('path');
var urlParser = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var objectId = 1;

var actions = {
  'GET': function(request, response) {
    var parts = urlParser.parse(request.url);
    var urlPath;

    if (parts.pathname === '/') {
      urlPath = '/index.html';
    } else {
      urlPath = parts.pathname;
    }

    httpHelpers.serveAssets(response, urlPath, function(error, result, statusCode) {
      let content = 'text/html';
      if (error) {
        httpHelpers.serveArchives(response, urlPath, function(error, result, statusCode) {
          if (error) {
            httpHelpers.sendResponse(response, 'Not Found', 404, content);
          } else {
            httpHelpers.sendResponse(response, result, statusCode, content);
          }
        });
      } else {
        httpHelpers.sendResponse(response, result, statusCode, content);
      }
    });
  },

  // 'GET': function(request, response) {
  //   var parts = urlParser.parse(request.url);
  //   var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
  //   httpHelpers.serveAssets(response, urlPath, function() {
  //     archive.isUrlInList(urlPath.slice(1), function(found) {
  //       if (found) {
  //         httpHelpers.sendRedirect(response, '/loading.html');
  //       } else {
  //         httpHelpers.send404(response);
  //       }
  //     });
  //   });
  // },

  'POST': function(request, response) {
    httpHelpers.collectData(request, function(data) {
      // data.objectId = ++objectId;
      archive.addUrlToList(data, function(error, result) {
        if (error) {
          console.error('Failed to post: ', error);
        } else {
          httpHelpers.sendRedirect(response, '/loading.html');
        }
      });
    });
  },

  // 'POST': function(request, response) {
  //   httpHelpers.collectData(request, function(data) {
  //     var url = data.toString().slice(4);
  //     archive.isUrlInList(url, function(found) {
  //       if (found) {
  //         //archived ? display page : display loading
  //         archive.isUrlArchived(url, function(exists) {
  //           if (exists) {
  //             httpHelpers.sendRedirect(response, '/' + url);
  //           } else {
  //             httpHelpers.sendRedirect(response, '/loading.html');
  //           }
  //         });
  //       } else {
  //         archive.addUrlToList(url, function() {
  //           httpHelpers.sendRedirect(response, '/loading.html');
  //         });
  //       }
  //     });
  //   });
  // },

  'OPTIONS': function(request, response) {
    httpHelpers.sendResponse(response, null);
  }

};


exports.handleRequest = function (request, response) {
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    httpHelpers.sendResponse(response, 'Not Found', 404);
  }
};


