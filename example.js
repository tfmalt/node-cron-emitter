/**
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var CronEmitter = require('cron-emitter');

var emitter = new CronEmitter();
var now     = new Date();

emitter.add('*/3  * * * * *', 'every_three_seconds');
emitter.add('*/10 * * * * *', 'every_ten_seconds');
emitter.add('0    * * * * *', 'every_minute');
emitter.add('* * * * * *',    "every_second_stop", {
    endDate: new Date(now.getTime()+5500)
});

console.log("done");

emitter.on('every_three_seconds', function() {
    "use strict";
    console.log("EVENT: Got every three seconds event.");
});

emitter.on('every_ten_seconds', function() {
    "use strict";
    console.log("EVENT: Got ten seconds event.");

    if (emitter.hasEvent("every_three_seconds")) {
        console.log("  Stopping every_three_seconds.");
        emitter.remove("every_three_seconds");
    }
});

var counter = 0;
emitter.on("every_second_stop", function() {
    "use strict";
    counter++;
    console.log("EVENT: got every second event: ", counter);
});