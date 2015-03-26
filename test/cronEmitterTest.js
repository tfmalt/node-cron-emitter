/**
 *
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var chai   = require('chai'),
    should = chai.should(),
    assert = chai.assert,
    expect = chai.expect,
    sinon  = require('sinon'),
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
            cm.add.should.throw(TypeError, /two arguments are mandatory/);
        });

        it('should throw TypeError when called without second argument', function() {
            cm.add.bind(cm, '*/3 * * * * *').should.throw(TypeError, /two arguments/);
        });

        it('should throw TypeError when called with invalid second argument', function() {
            cm.add.bind(cm, '*/3 * * * * *', "352").should.throw(TypeError, /second argument/);
        });

        it('should throw TypeError when called without illegal cron argument', function() {
            cm.add.bind(cm, 'ninja', 'ninja').should.throw(Error, /first argument/);
        });

        it('should register an event correct when everyting is correct', function() {
            expect(cm.add('* * * * * *', "second")).to.be.true;
        });

        it('should emit event after one second', function(done) {
            this.timeout(0);
            var counter = 0;
            var errTimeout = setTimeout(function() {
                assert.fail("Did not get event");
            }, 3000);
            cm.on('aSecond', function() {
                counter++;
                if (counter > 2) {
                    clearTimeout(errTimeout);
                    assert(true, "Got event");
                    done();
                }
            });

            cm.add('* * * * * *', "aSecond");

        })
    });
});