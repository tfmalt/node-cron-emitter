/**
 * This is a simple event emitter that accepts crontab like instructions to
 * schedule events.
 *
 * @see https://github.com/harrisiirak/cron-parser
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015, 2017 (c) Thomas Malt
 * @license MIT
 */

const parser = require('cron-parser');
const EventEmitter = require('events').EventEmitter;

/**
 * Return a new CronEmitter object
 *
 * @constructor
 * @extends events.EventEmitter
 */
class CronEmitter extends EventEmitter {
  constructor() {
    super();

    this.timers = {};
    this.crontab = {};
  }

  /**
   * Adds a new event to the list of events to be emitted.
   *
   * @param crontab
   * @param name
   * @param options
   */
  add(crontab, name, options) {
    "use strict";

    // Verify that function has the required arguments
    if (arguments.length < 2) {
      throw new TypeError(
        'two arguments are mandatory. First argument must be a valid ' +
        'cron specification. Second argument is the name of the event ' +
        'to emit.'
      );
    }

    // Verify that the event name is a string
    if (typeof name !== 'string') {
      throw new TypeError(
        'second argument must be name of the event consisting of a string'
      );
    }

    // Try to run. This will throw and exception if the crontab string
    // is not correct so we don't need to check for that ourselves.
    try {
      let interval = parser.parseExpression(crontab, options);

      this._register(interval, name);
      return true;
    } catch (e) {
      e.message = "first argument must be a valid cron string. See cron " +
        "documentation for information about this.";
      throw e;
    }
  }

  /**
   * Remove an event from the list of events
   *
   * @throws TypeError
   * @param name
   * @returns {boolean}
   */
  remove(name) {
    "use strict";

    if (!(this._crontab.hasOwnProperty(name))) {
      throw new TypeError('No such event. Argument must be a valid event name');
    }

    clearTimeout(this._timers[name]);
    delete this._crontab[name];

    return true;
  }

  hasEvent(name) {
    "use strict";
    return this._crontab.hasOwnProperty(name);
  }

  /**
   * Returns object with all the registered emitters
   *
   * @returns {{}|*}
   */
  getEventList() {
    "use strict";

    return this._crontab;
  }

  /**
   * Adds a new cron job to the list of jobs to execute. Interval until next
   * emitted event is always calculated.
   *
   * @param interval
   * @param name
   * @private
   */
  _register(interval, name) {
    "use strict";

    this._crontab[name] = interval;

    let next = interval.next();
    next.setMilliseconds(0);
    let delay = next.getTime() - (new Date()).getTime();

    this._timers[name] = setTimeout(function() {
      this._setTimeout(interval, name);
    }, delay);
  }

  /**
   * Manages the interval for the next timeout or stops execution if the
   * job was started with a specific end date.
   *
   * @param interval
   * @param name
   * @private
   */
  _setTimeout(interval, name) {
    "use strict";
    let next;

    try {
      next = interval.next();
      next.setMilliseconds(0);
    } catch (e) {
      return;
    }

    this.emit(name);

    this._timers[name] = setTimeout(function() {
      this._setTimeout(interval, name);
    }, (next.getTime() - (new Date()).getTime()));
  }
}

module.exports = CronEmitter;
