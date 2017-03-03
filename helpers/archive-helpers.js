var fs = require('fs');
var path = require('path');
var request = require('request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, data) {
    if (error) {
      callback(null, error);
    } else {
      var urlArray = data.split('\n');
      callback(urlArray);
    }
  });
};



// exports.readListOfUrls = function(callback) {
//   fs.readFile(exports.paths.list, 'utf8', function(error, sites) {
//     sites = sites.toString().split('\n');
//     if (callback) {
//       callback(sites);
//     }
//   });
// };

exports.isUrlInList = function(url, callback) {
  // regexp will probs solve this easy
  exports.readListOfUrls(function(data, error) {
    if (error) {
      callback(error, null);
    }
    let result = false;
    let pattern = new RegExp(url.replace('www.', ''));
    _.each(data, function(element) {
      if (element.match(pattern)) {
        result = true;
      }
    });
    callback(result);
  });
};

// exports.isUrlInList = function(url, callback) {
//   exports.readListOfUrls(function(sites) {
//     var found = _.any(sites, function(site, i) {
//       return site.match(url_);
//     })
//     callback(found);
//   });
// };

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(error, data) {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  // probs regexp here too
  fs.access(exports.paths.archivedSites + '/' + url, function(error) {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  // probs regexp here too
  fs.access(exports.paths.archivedSites + '/' + url, function(error) {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    if (!url) {
      return;
    }
    exports.isUrlArchived(url, function(exists) {
      if (exists) {
        console.log('Site already archived');
      } else {
        request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
      }
    });
  });
};
