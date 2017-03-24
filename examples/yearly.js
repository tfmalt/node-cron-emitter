/**
 * Example showing the use of remove in cron-emitter.
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015-2017 (c) Thomas Malt
 */
"use strict";

const CronEmitter = require('../lib/cron-emitter');
const emitter     = new CronEmitter();

emitter
  .add('@yearly', 'got_it')
  .on('got_it', () => console.log(new Date(), '==> got it:'));
