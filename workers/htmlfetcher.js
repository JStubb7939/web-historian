// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;

new CronJob('01*****', function() {
  // job here
  archive.downloadUrls(archive.readListOfUrlsAsynccron);
}, null, true, 'America/Los_Angeles');
