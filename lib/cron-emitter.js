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

class CronEmitter extends EventEmitter {
  /**
   * Return a new CronEmitter object
   *
   * @constructor
   * @extends EventEmitter
   */
  constructor() {
    super();
    this.timers  = {};
    this.crontab = {};
  }

  /**
   * Adds a new event to the list of events to be emitted.
   * CronEmitter exposes the same options as cron-parser to provide a
   * start date and an end date for when events should be emitted:
   *
   * @see https://www.npmjs.com/package/cron-parser
   * @param {string} crontab the crontab declaration
   * @param {string} name the name of the event you want to emit.
   * @param {object} options an object with options to cron-parser
   * @return {CronEmitter} A reference to self function.
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
    this.register(parser.parseExpression(crontab, options), name);
    return this;
  }

  /**
   * Remove an event from the list of events
   *
   * @throws TypeError
   * @param {string} name of the event to remove.
   * @returns {CronEmitter} self when successful
   */
  remove(name) {
    if (!(this.crontab.hasOwnProperty(name))) {
      throw new TypeError('No such event. Argument must be a valid event name');
    }

    clearTimeout(this.timers[name]);
    delete this.crontab[name];

    this.emit('removed', name);
    return this;
  }

  hasEvent(name) {
    return this.crontab.hasOwnProperty(name);
  }

  /**
   * Returns object with all the registered emitters
   *
   * @returns {object} the list of events.
   */
  getEventList() {
    return this.crontab;
  }

  /**
   * Adds a new cron job to the list of jobs to execute. Interval until next
   * emitted event is always calculated.
   *
   * @param {object} interval cron-parser parseExpression
   * @param {string} name of event.
   * @return {object} the Timeout object for the settimeout.
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
   * @param {object} interval the crontab events iterator
   * @param {string} name of event to emit.
   * @private
   */
  setTimeout(interval, name) {
    /* istanbul ignore if */
    if (!this.hasEvent(name)) {
      // event has been removed
      clearTimeout(this.timers[name]);
      return;
    }

    try {
      const next = interval.next();
      this.emit(name);

      this.timers[name] = setTimeout(
        () => this.setTimeout(interval, name),
        (next.getTime() - (new Date()).getTime())
      );
    } catch (error) {
      /* istanbul ignore else */
      if (error.message.match(/Out of the timespan range/)) {
        this.remove(name);
        this.emit('ended', name);
      } else if (error.message.match(/No such event/)) {
        console.log('Got error in setTimeout:', name, error.message);
        throw error;
      } else {
        console.log('Got error in setTimeout: ', error.message);
        throw error;
      }
    }
  }
}

module.exports = CronEmitter;
