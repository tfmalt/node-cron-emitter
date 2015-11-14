/**
 *
 * Created by tm on 25/03/15.
 *
 * @author tm
 * @copyright 2015 (c) tm
 */

var chai   = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    events = require('events'),
    cron   = require('../lib/cronEmitter');

chai.should();

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

        });

        it('should respect stop time if given in options', function(done) {
            var end = new Date((new Date()).getTime()+7000);
            cm.add("*/2 * * * * *", "every_second", {
                endDate: end
            });

            var counter = 0;
            var last = null;
            try {
                while (last = cm._crontab['every_second'].next()) {
                    counter++;
                }
            }
            catch (e) {
                e.should.be.instanceOf(Error);
                expect(last).to.be.instanceOf(Date);
                expect(last).to.not.be.greaterThan(end);
                expect(counter).to.equal(3);
                done();
            }
        });
    });

    describe('getEventList', function() {
        "use strict";
        var emitter;
        before(function() {
            emitter = new cron.CronEmitter();
        });

        it('should return a correct list of events', function() {
            var list = emitter.getEventList();
            expect(list).to.be.instanceOf(Object);
            expect(Object.keys(list).length).to.equal(0);

            emitter.add("* * * * *", "every_minute");

            var nyList = emitter.getEventList();
            expect(Object.keys(nyList).length).to.equal(1);

            expect(nyList.hasOwnProperty("every_minute")).to.be.true;

        });

        after(function() {
            emitter = undefined;
        });
    });

    describe('remove', function() {
        "use strict";
        var em;
        before(function() {
            em = new cron.CronEmitter();
            em.add('* * * * * *', "every_second");
            em.add('0 * * * *', "every_hour");
        });

        it('should have correct initial content', function() {
            expect(Object.keys(em.getEventList()).length).to.equal(2);
            expect(Object.keys(em.getEventList())).to.deep.equal([
                "every_second", "every_hour"
            ]);
        });

        it('should delete content correctly', function() {
            expect(em.remove("every_second")).to.be.true;
            expect(Object.keys(em.getEventList())).to.deep.equal([
                "every_hour"
            ]);
        });

        it('should handle being asked to delete something non existing', function() {
            expect(em.remove.bind(em, "not_here")).to.throw(TypeError, /No such event/);
        });
    });

    describe('hasEvent', function() {
        "use strict";
        var em;
        before(function() {
            em = new cron.CronEmitter();
            em.add('0 0 31 * *', 'everyMonth');
        });

        it('should return true when event exist', function() {
            em.hasEvent('everyMonth').should.be.true;
        });

        it('should return false when event does not', function() {
            em.hasEvent('right_now').should.be.false;
        });

    });
});
