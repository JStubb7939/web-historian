var fs = require('fs');
var path = require('path');
var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
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





/////////////////////////////////
///     PROMISES APPROACH     ///
/////////////////////////////////





exports.readListOfUrlsAsync = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(error, data) {
      if (error) {
        reject(error);
      } else {
        var urlArray = data.split('\n');
        resolve(urlArray);
      }
    });
  });
};


exports.isUrlInListAsync = function (url) {
  return exports.readListOfUrlsAsync()
  .then(function(sites) {
    return new Promise(function(resolve, reject) {
      var found = _.any(sites, function(site, i) {
        return site.match(url);
      });
      resolve(found);
    });
  });
};

exports.addUrlToListAsync = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};


exports.isUrlArchivedAsync = function(url) {
  return new Promise(function(resolve, reject) {
    fs.access(exports.paths.archivedSites + '/' + url, function(error) {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    if (!url) {
      return;
    }
    exports.isUrlArchivedAsync(url)
      .then(function(found) {
        if (found) {
          console.log('Site already archived');
        } else {
          request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
        }
      });
  });
};









/////////////////////////////////
///     CALLBACK APPROACH     ///
/////////////////////////////////








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



exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, sites) {
    sites = sites.toString().split('\n');
    if (callback) {
      callback(sites);
    }
  });
};


exports.isUrlInList = function(url, callback) {
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
      callback(null, 'successful post');
    }
  });
};


exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, function(error) {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};