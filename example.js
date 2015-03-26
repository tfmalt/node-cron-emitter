/**
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var cron = require('./lib/cronEmitter');

var emitter = new cron.CronEmitter();
var now     = new Date();

emitter.add('*/3  * * * * *', 'three_secs');
emitter.add('*/10 * * * * *', 'ten_secs');
emitter.add('0    * * * * *', 'every_minute');
emitter.add('* * * * * *', "every_second_stop", {
    endDate: new Date(now.getTime()+5500)
});
console.log("done");

emitter.on('ten_secs', function() {
    "use strict";
    console.log("EVENT: Got ten seconds event!");
});

var counter = 0;
emitter.on("every_second_stop", function() {
    "use strict";
    counter++;
    console.log("EVENT: got second: ", counter);
});