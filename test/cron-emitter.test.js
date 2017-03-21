/**
 *
 * Created by tm on 25/03/15.
 *
 * @author Thomas Malt
 * @copyright 2015-2017 (c) Thomas Malt
 */

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const events = require('events');
const timers = require('timers');
const CronEmitter = require('../lib/cron-emitter');

chai.should();

describe('Create object', () => {
  it('should return a new CronEmitter object', () => {
    (new CronEmitter()).should.be.instanceOf(CronEmitter);
  });

  it('should also be an eventemitter', () => {
    (new CronEmitter()).should.be.instanceOf(events.EventEmitter);
  });

  describe('add', () => {
    let cm;

    beforeEach(() => {
      cm = new CronEmitter();
    });

    it('should throw TypeError when called without an argument', () => {
      cm.add.should.throw(TypeError, /two arguments are mandatory/);
    });

    it('should throw TypeError when called without second argument', () => {
      cm.add.bind(cm, '*/3 * * * * *').should.throw(TypeError, /two arguments/);
    });

    it('should throw Error when called without illegal cron argument', () => {
      cm.add.bind(cm, 'ninja', 'ninja').should.throw(Error);
    });

    it('should register an event correct when everyting is correct', () => {
      cm.add('* * * * * *', "second").should.be.a('object');
    });

    it('should emit event after one second', function(done) {
      this.timeout(4000);
      let counter = 0;
      let errTimeout = setTimeout(() => {
        assert.fail("Did not get event");
      }, 3000);
      cm.on('aSecond', () => {
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
      var end = new Date((new Date()).getTime() + 7000);
      cm.add("*/2 * * * * *", "every_second", {
        endDate: end
      });

      var counter = 0;
      var last = null;
      try {
        while (last = cm.crontab['every_second'].next()) {
          counter++;
        }
      } catch (e) {
        console.log(e.message);
        e.should.be.instanceOf(Error);
        expect(last).to.be.a('object');
        expect(last.getTime()).to.not.be.greaterThan(end.getTime());
        expect(counter).to.equal(3);
        done();
      }
    });
  });

  describe('getEventList', () => {
    "use strict";
    var emitter;
    before(() => {
      emitter = new CronEmitter();
    });

    it('should return a correct list of events', () => {
      var list = emitter.getEventList();
      expect(list).to.be.instanceOf(Object);
      expect(Object.keys(list).length).to.equal(0);

      emitter.add("* * * * *", "every_minute");

      var nyList = emitter.getEventList();
      expect(Object.keys(nyList).length).to.equal(1);

      expect(nyList.hasOwnProperty("every_minute")).to.be.true;

    });

    after(() => {
      emitter = undefined;
    });
  });

  describe('remove', () => {
    "use strict";
    var em;
    before(() => {
      em = new CronEmitter();
      em.add('* * * * * *', "every_second");
      em.add('0 * * * *', "every_hour");
    });

    it('should have correct initial content', () => {
      expect(Object.keys(em.getEventList()).length).to.equal(2);
      expect(Object.keys(em.getEventList())).to.deep.equal([
        "every_second", "every_hour"
      ]);
    });

    it('should delete content correctly', () => {
      expect(em.remove("every_second")).to.be.true;
      expect(Object.keys(em.getEventList())).to.deep.equal([
        "every_hour"
      ]);
    });

    it('should handle being asked to delete something non existing', () => {
      expect(em.remove.bind(em, "not_here")).to.throw(TypeError, /No such event/);
    });
  });

  describe('hasEvent', () => {
    "use strict";
    var em;
    before(() => {
      em = new CronEmitter();
      em.add('0 0 31 * *', 'everyMonth');
    });

    it('should return true when event exist', () => {
      em.hasEvent('everyMonth').should.be.true;
    });

    it('should return false when event does not', () => {
      em.hasEvent('right_now').should.be.false;
    });

  });
});
