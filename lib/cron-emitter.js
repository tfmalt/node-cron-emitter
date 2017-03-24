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

const parser       = require('cron-parser');
const EventEmitter = require('events').EventEmitter;
const MAX_DELAY    = 2147483647;
const delay        = next => next.getTime() - Date.now();

class CronEmitter extends EventEmitter {
  /**
   * Return a new CronEmitter object
   *
   * @constructor
   * @extends EventEmitter
   */
  constructor() {
    super();
    this.timers    = {};
    this.crontab   = {};
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

  /**
   * Checks wether an event with a given name is registered.
   *
   * @param {string} name The name of event to check for
   * @return {Boolean} true if event with name is registered.
   */
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
    return this.setCronTimeout(interval, interval.next(), name);
  }

  /**
   * Manages the interval for the next timeout or stops execution if the
   * job was started with a specific end date.
   *
   * Added logic to fix javascripts/nodes problem with timeouts larger than 2^31.
   * Chosen strategy is to split timeout into pieces until remaining timeouts
   * is less than 2^31 (2147483648)
   *
   * @param {CronExpression} interval The CronExpression we're dealing with.
   * @param {CronDate} next The CronDate describing next time to fire event
   * @param {string} name The name of the event we should fire.
   * @return {Timeout} Timeout object returned from node timers setTimeout
   * @private
   */
  setCronTimeout(interval, next, name) {
    /* istanbul ignore if */
    if (!this.hasEvent(name)) {
      // event has been removed
      clearTimeout(this.timers[name]);
      return;
    }

    const handleDelay = (delay = MAX_DELAY) => {
      this.timers[name] = setTimeout(
        () => this.setCronTimeout(interval, next, name), delay
      );
      return this.timers[name];
    };

    if (delay(next) > MAX_DELAY) return handleDelay();
    if (delay(next) > 0)         return handleDelay(delay(next));

    try {
      const newNext  = interval.next();

      this.emit(name);

      this.timers[name] = setTimeout(
        () => this.setCronTimeout(interval, newNext, name),
        delay(newNext)
      );

      return this.timers[name];
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
