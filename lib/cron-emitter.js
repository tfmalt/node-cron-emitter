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

"use strict";

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
    return this.register(parser.parseExpression(crontab, options), name);
  }

  /**
   * Remove an event from the list of events
   *
   * @throws TypeError
   * @param name
   * @returns {boolean}
   */
  remove(name) {
    if (!(this.crontab.hasOwnProperty(name))) {
      throw new TypeError('No such event. Argument must be a valid event name');
    }

    clearTimeout(this.timers[name]);
    delete this.crontab[name];

    return true;
  }

  hasEvent(name) {
    return this.crontab.hasOwnProperty(name);
  }

  /**
   * Returns object with all the registered emitters
   *
   * @returns {{}|*}
   */
  getEventList() {
    return this.crontab;
  }

  /**
   * Adds a new cron job to the list of jobs to execute. Interval until next
   * emitted event is always calculated.
   *
   * @param interval
   * @param name
   * @private
   */
  register(interval, name) {
    this.crontab[name] = interval;

    const delay = interval.next().getTime() - (new Date()).getTime();

    this.timers[name] = setTimeout(() => this.setTimeout(interval, name), delay);
    return this.timers[name];
  }

  /**
   * Manages the interval for the next timeout or stops execution if the
   * job was started with a specific end date.
   *
   * @param interval
   * @param name
   * @private
   */
  setTimeout(interval, name) {
    let next = interval.next();
    this.emit(name);

    this.timers[name] = setTimeout(
      () => this.setTimeout(interval, name),
      (next.getTime() - (new Date()).getTime())
    );
  }
}

module.exports = CronEmitter;
