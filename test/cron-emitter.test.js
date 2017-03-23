/**
 *
 * Created by tm on 25/03/15.
 *
 * @author Thomas Malt
 * @copyright 2015-2017 (c) Thomas Malt
 */

"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const events = require('events');
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

    it('should throw Typeerror when called with illegal second argument', () => {
      cm.add.bind(cm, '* * * * * *', []).should.throw(TypeError, /second argument/);
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
      const errTimeout = setTimeout(() => {
        assert.fail("Did not get event");
      }, 3000);
      cm.on('aSecond', () => {
        counter++;
        if (counter === 3) {
          clearTimeout(errTimeout);
          assert(true, "Got event");
          done();
        }
      });

      cm.add('* * * * * *', "aSecond");

    });

    it('should handle end of event series gracefully', function(done) {
      const end = new Date(Date.now() + 1100);
      cm.add('* * * * * *', 'end_event_gracefully', {endDate: end});
      cm.on('ended', (name) => {
        if (name === 'end_event_gracefully') {
          expect(name).to.equal('end_event_gracefully');
          done();
        }
      });
    });
  });

  describe('getEventList', () => {
    let emitter;
    before(() => {
      emitter = new CronEmitter();
    });

    it('should return a correct list of events', () => {
      const list = emitter.getEventList();
      expect(list).to.be.instanceOf(Object);
      expect(Object.keys(list).length).to.equal(0);

      emitter.add("* * * * *", "every_minute");

      const nyList = emitter.getEventList();
      expect(Object.keys(nyList).length).to.equal(1);

      expect(nyList.hasOwnProperty("every_minute")).to.be.true;

    });

    after(() => {
      emitter = undefined;
    });
  });

  describe('remove', () => {
    let em;
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
    let em;
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
