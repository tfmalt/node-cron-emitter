/**
 * Example showing the use of cron-emitter.
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015-2017 (c) Thomas Malt
 */
"use strict";

const CronEmitter = require('../lib/cron-emitter');
const emitter     = new CronEmitter();

const now       = () => (new Date()).toJSON();
const increment = (counter = 0) => (counter + 1);

emitter.add('*/3  * * * * *', 'every_three_seconds');
emitter.add('*/10 * * * * *', 'every_ten_seconds');
emitter.add('0    * * * * *', 'every_minute');
emitter.add('0  */5 * * * *', 'every_five_minutes');
emitter.add('0 */30 * * * *', 'every_thirty_minutes');
emitter.add('* * * * * *', "every_second_stop", {
  endDate: new Date(Date.now() + 10500)
});

console.log(now(), "==> Done setting up events");

emitter.on('ended', (name) => {
  console.log(now(), `==> ENDED: event series "${name}" is done.`);
  switch (name) {
  case 'every_second_stop':
    emitter.add(
      '*/2 * * * * *', 'every_two_seconds',
      {endDate: new Date(Date.now() + 10500)}
      );
    break;
  }
});

emitter.on('every_three_seconds', () => {
  console.log(now(), "==> EVENT: Got every three seconds event.");
});

emitter.on('every_ten_seconds', () => {
  console.log(now(), "==> EVENT: Got ten seconds event.");
});

emitter.on('every_minute', () => {
  console.log(now(), "==> EVENT: A minute has passed");
});

emitter.on('every_five_minutes', () => {
  console.log(now(), "==> EVENT: Five minutes has passed");
});

emitter.on('every_thirty_minutes', () => {
  console.log(now(), "==> EVENT: Thirty minutes has passed");
});

let counter = 0;
emitter.on("every_second_stop", () => {
  counter = increment(counter);
  console.log(now(), "==> EVENT: got every second event: ", counter);
});

emitter.on('every_two_seconds', () => {
  console.log(now(), "==> EVENT: got every two seconds event.");
});
