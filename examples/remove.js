/**
 * Example showing the use of remove in cron-emitter.
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015-2017 (c) Thomas Malt
 */
"use strict";

const CronEmitter = require('../lib/cron-emitter');
const emitter     = new CronEmitter();

emitter.add('*/2 * * * * *', 'got_it');
console.log(new Date(), '==> Added event every two seconds');

let counter = 0;
emitter.on('got_it', () => {
  counter++;
  console.log(new Date(), '==> got it:', counter);

  if (counter > 1) {
    emitter.remove('got_it');
  }
});

emitter.on('removed', (event) => {
  console.log(new Date(), `==> The event "${event}" was removed.`);
});
