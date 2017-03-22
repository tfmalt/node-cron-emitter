/**
 * Created by tm on 25/03/15.
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015-2017 (c) Thomas Malt
 */

const CronEmitter = require('./lib/cron-emitter');

const emitter = new CronEmitter();
const now = new Date();

emitter.add('*/3  * * * * *', 'every_three_seconds');
emitter.add('*/10 * * * * *', 'every_ten_seconds');
emitter.add('0    * * * * *', 'every_minute');
emitter.add('0  */5 * * * *', 'every_five_minutes');
emitter.add('0 */30 * * * *', 'every_thirty_minutes');
emitter.add('* * * * * *', "every_second_stop", {
  endDate: new Date(now.getTime() + 10500)
});

console.log("done");

emitter.on('every_three_seconds', () => {
  console.log(Date(), "EVENT: Got every three seconds event.");
});

emitter.on('every_ten_seconds', () => {
  console.log(Date(), "EVENT: Got ten seconds event.");
});

emitter.on('every_minute', function() {
  console.log(Date(), "EVENT: A minute has passed");
});

emitter.on('every_five_minutes', function() {
  console.log(Date(), "EVENT: Five minutes has passed");
});

emitter.on('every_thirty_minutes', function() {
  console.log(Date(), "EVENT: Thirty minutes has passed");
});

var counter = 0;
emitter.on("every_second_stop", function() {
  counter++;
  console.log(Date(), "EVENT: got every second event: ", counter);
});
