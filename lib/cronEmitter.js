/**
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */
var utils  = require('util'),
    parser = require('cron-parser'),
    events = require('events');

var CronEmitter = function() {
    events.EventEmitter.call(this);
};

utils.inherits(CronEmitter, events.EventEmitter);

CronEmitter.prototype.timers = {};

/**
 *
 * @param cronstr
 * @param name
 */
CronEmitter.prototype.add = function(cronstr, name) {
    "use strict";

    var interval = parser.parseExpression(cronstr);

    this._register(interval, name);
    return undefined;
};

CronEmitter.prototype._register = function(interval, name) {
    "use strict";

    var next = interval.next();
    next.setMilliseconds(0);

    var delay = next.getTime() - (new Date()).getTime();
    var that = this;

    console.log("registering new emitter '", name, "': ", next.toJSON(), ", delay: ", delay);

    this.timers[name] = setTimeout(function() {
        that._setTimeout(interval, name);
    }, delay);

};

CronEmitter.prototype._setTimeout = function(interval, name) {
    "use strict";
    var that  = this;
    var next  = interval.next();
    next.setMilliseconds(0);

    console.log("triggering event: '" + name + "' ", (new Date()).toJSON());
    this.emit(name);
    this.timers[name] = setTimeout(function() {
        that._setTimeout(interval, name);
    }, (next.getTime() - (new Date).getTime()));
};

exports.CronEmitter = CronEmitter;