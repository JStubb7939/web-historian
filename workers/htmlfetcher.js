// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

(function() {
  archive.downloadUrls(archive.readListOfUrls);
})();
