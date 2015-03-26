/**
 * This is a simple event emitter that accepts crontab like instructions to
 * schedule events.
 *
 * @see https://github.com/harrisiirak/cron-parser
 *
 * @author Thomas Malt <thomas@malt.no>
 * @copyright 2015 (c) Thomas Malt
 */
var utils  = require('util'),
    parser = require('cron-parser'),
    events = require('events');

/**
 * Return a new CronEmitter object
 *
 * @constructor
 * @inherits events.EventEmitter
 */
var CronEmitter = function() {
    events.EventEmitter.call(this);
};

utils.inherits(CronEmitter, events.EventEmitter);

CronEmitter.prototype.timers    = {};
CronEmitter.prototype.intervals = {};

/**
 * Adds a new event to the list of events to be emitted.
 *
 * @param crontab
 * @param name
 * @param options
 */
CronEmitter.prototype.add = function(crontab, name, options) {
    "use strict";

    if (arguments.length < 2) {
        throw new TypeError(
            'two arguments are mandatory. First argument must be a valid ' +
            'cron specification. Second argument is the name of the event ' +
            'to emit.'
        )
    }
    if ( !(name.match(/[a-zA-Z_]/)) ) {
        throw new TypeError(
            'second argument must be name of the event consisting of ' +
            'the characters a-z, A-Z and _'
        );
    }

    try {
        var interval = parser.parseExpression(crontab, options);

        this._register(interval, name);
        return true;
    }
    catch (e) {
        e.message = "first argument must be a valid cron string. See cron " +
            "documentation for information about this.";
        throw e;
    }
};

/**
 * Adds a new cron job to the list of jobs to execute. Interval until next
 * emitted event is always calculated.
 *
 * @param interval
 * @param name
 * @private
 */
CronEmitter.prototype._register = function(interval, name) {
    "use strict";

    this.intervals[name] = interval;

    var next = interval.next();
    next.setMilliseconds(0);

    var delay = next.getTime() - (new Date()).getTime();
    var that = this;

    this.timers[name] = setTimeout(function () {
        that._setTimeout(interval, name);
    }, delay);
};

CronEmitter.prototype._setTimeout = function(interval, name) {
    "use strict";
    var that  = this;
    var next;

    try {
        next = interval.next();
        next.setMilliseconds(0);
    }
    catch (e) {
        return;
    };

    // console.log("triggering event: '" + name + "' ", (new Date()).toJSON());
    this.emit(name);
    this.timers[name] = setTimeout(function() {
        that._setTimeout(interval, name);
    }, (next.getTime() - (new Date).getTime()));
};

exports.CronEmitter = CronEmitter;