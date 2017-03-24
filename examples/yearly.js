/**
 * Example showing the use of yearly as input to cron-emitter.
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015-2017 (c) Thomas Malt
 */
"use strict";

const CronEmitter = require('../lib/cron-emitter');
const emitter     = new CronEmitter();

emitter
  .add('@yearly', 'got_it')
  .add('*/5 * * * * *', 'seconds')
  .on('removed', (name) => console.log(new Date(), '==> removed', name))
  .on('seconds', () => console.log(new Date(), '==> 5 seconds'))
  .on('got_it', () => console.log(new Date(), '==> got it:'));


setTimeout(() => emitter.remove('got_it'), 15000);
setTimeout(() => emitter.remove('seconds'), 25000);
