/**
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var CronEmitter = require('./lib/cronEmitter').CronEmitter;

var emitter = new CronEmitter();
var now     = new Date();

emitter.add('*/3  * * * * *', 'every_three_seconds');
emitter.add('*/10 * * * * *', 'every_ten_seconds');
emitter.add('0    * * * * *', 'every_minute');
emitter.add('0  */5 * * * *', 'every_five_minutes');
emitter.add('0 */30 * * * *', 'every_thirty_minutes');
emitter.add('* * * * * *',    "every_second_stop", {
    endDate: new Date(now.getTime()+10500)
});

console.log("done");

emitter.on('every_three_seconds', function() {
    "use strict";
    console.log(Date(), "EVENT: Got every three seconds event.");
});

emitter.on('every_ten_seconds', function() {
    "use strict";
    console.log(Date(), "EVENT: Got ten seconds event.");
});

emitter.on('every_minute', function() {
    "use strict";
    console.log(Date(), "EVENT: A minute has passed");
});

emitter.on('every_five_minutes', function() {
    "use strict";
    console.log(Date(), "EVENT: Five minutes has passed");
});

emitter.on('every_thirty_minutes', function() {
    "use strict";
    console.log(Date(), "EVENT: Thirty minutes has passed");
});

var counter = 0;
emitter.on("every_second_stop", function() {
    "use strict";
    counter++;
    console.log(Date(), "EVENT: got every second event: ", counter);
});