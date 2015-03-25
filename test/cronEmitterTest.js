/**
 *
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var chai   = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    events = require('events'),
    cron   = require('../lib/cronEmitter');


describe('Create object', function() {
    it('should return a new CronEmitter object', function() {
        "use strict";
        (new cron.CronEmitter()).should.be.instanceOf(cron.CronEmitter);
    });

    it('should also be an eventemitter', function() {
        "use strict";
        (new cron.CronEmitter()).should.be.instanceOf(events.EventEmitter);
    });

    describe('add', function() {
        "use strict";
        var cm;
        beforeEach(function() {
            cm = new cron.CronEmitter();
        });
        it('should throw TypeError when called without an argument', function() {
            cm.add.should.throw(TypeError);
        });
        it('should create a new interval correctly', function(done) {
            expect(cm.add('*/3 * * * * *')).to.be.undefined;
            done();
        });
    });
});