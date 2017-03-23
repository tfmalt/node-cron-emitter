[![npm version](https://badge.fury.io/js/cron-emitter.svg)](http://badge.fury.io/js/cron-emitter)
[![Build Status](https://travis-ci.org/tfmalt/node-cron-emitter.svg?branch=master)](https://travis-ci.org/tfmalt/node-cron-emitter)
[![Code Climate](https://codeclimate.com/github/tfmalt/node-cron-emitter/badges/gpa.svg)](https://codeclimate.com/github/tfmalt/node-cron-emitter)
[![Test Coverage](https://codeclimate.com/github/tfmalt/node-cron-emitter/badges/coverage.svg)](https://codeclimate.com/github/tfmalt/node-cron-emitter)
[![Dependency Status](https://david-dm.org/tfmalt/node-cron-emitter.svg)](https://david-dm.org/tfmalt/node-cron-emitter)

# cron-emitter

This is an event emitter that uses crontab instructions to register the events
to be emitted at regular intervals. This module uses
[cron-parser](https://github.com/harrisiirak/cron-parser)
to parse the crontab instructions. See also
[node-cron](https://github.com/ncb000gt/node-cron) for a similar project with
a more traditional node.js callback approach.

The main difference between this Library and
[node-cron](https://github.com/ncb000gt/node-cron) is that this library aims
to implement the event listener pattern, to achieve capabilities found in the
[Observer Pattern](http://en.wikipedia.org/wiki/Observer_pattern) and the
[PUB/SUB Pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

This enables you to write highly decoupled, functional and reactive code with
lower complexity per function than callback driven code. You can delegate
responsibility for dealing with events to as many different subsystems as we
want, all listening to the same event notifications.

* [Install](#Install)
* [Crontab syntax](#Crontab-syntax)
* [Usage](#Usage)
  * [Creating an Object](#Creating-an-object)
  * [Adding an event](#Adding-an-event)
  * [Options](#Options)
* [API](#API)
* [Example](#Example)

## Install
```bash
$ npm install --save cron-emitter
```

## Crontab syntax
See [cron-parser](https://github.com/harrisiirak/cron-parser) for a simple
introduction to the crontab syntax.
If you"re on a Linux or OS X computer type
```bash
$ man crontab
```

## Usage

### Creating an object
```javascript
const CronEmitter = require('cron-emitter');
const emitter     = new CronEmitter();
```

### Adding an event
```javascript
emitter.add('0 */30 * * * *', 'every_thirty_minutes');
```
### Options

CronEmitter exposes the [same options as cron-parser](https://github.com/harrisiirak/cron-parser#options) to provide
a start date and an end date for when events should be emitted:

```javascript
emitter.add('0 0 */2 * * *', 'every_two_hours', {
  currentDate: new Date(),
  endDate: '2017-05-31'
});
```

## API

<a name="new_CronEmitter_new"></a>

### new CronEmitter()
Return a new CronEmitter object

<a name="CronEmitter+add"></a>

### cronEmitter.add(crontab, name, options) ⇒ <code>Timeout</code>
Adds a new event to the list of events to be emitted.
CronEmitter exposes the same options as cron-parser to provide a
start date and an end date for when events should be emitted:

- **Kind**: instance method of <code>[CronEmitter](#CronEmitter)</code>
- **Returns**: <code>Timeout</code> - Timeout from the setTimeout function.
- **See**: https://www.npmjs.com/package/cron-parser

| Param | Type | Description |
| --- | --- | --- |
| crontab | <code>string</code> | the crontab declaration |
| name | <code>string</code> | the name of the event you want to emit. |
| options | <code>object</code> | an object with options to cron-parser |

<a name="CronEmitter+remove"></a>

### cronEmitter.remove(name) ⇒ <code>boolean</code>
Remove an event from the list of events

- **Kind**: instance method of <code>[CronEmitter](#CronEmitter)</code>
- **Returns**: <code>boolean</code> - true when successful
- **Throws**:

  - TypeError


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the event to remove. |

<a name="CronEmitter+getEventList"></a>

### cronEmitter.getEventList() ⇒ <code>object</code>
Returns object with all the registered emitters

- **Kind**: instance method of <code>[CronEmitter](#CronEmitter)</code>
- **Returns**: <code>object</code> - the list of events.

## Example


```javascript
const CronEmitter = require('../lib/cron-emitter');
const emitter     = new CronEmitter();

const now       = () => (new Date()).toJSON();
const increment = (counter = 0) => (counter + 1);

emitter.add('*/3  * * * * *', 'every_three_seconds');
emitter.add('*/10 * * * * *', 'every_ten_seconds');
emitter.add('0 * * * * *',    'every_minute');
emitter.add('0 */5 * * * *',  'every_five_minutes');
emitter.add('0 */30 * * * *', 'every_thirty_minutes');
emitter.add('* * * * * *',    'every_second_stop', {
  endDate: new Date(Date.now() + 10500)
});

console.log(now(), "==> Done setting up events");

emitter.on('ended', (name) => {
  console.log(now(), `==> ENDED: event series "${name}" has ended.`);
  switch (name) {
  case 'every_second_stop':
    emitter.add(
      '*/2 * * * * *', 'every_two_seconds',
      {endDate: new Date(Date.now() + 10500)}
      );
    break;
  }
});

emitter.on('every_three_seconds', () => {
  console.log(now(), "==> EVENT: Got every three seconds event.");
});

emitter.on('every_ten_seconds', () => {
  console.log(now(), "==> EVENT: Got ten seconds event.");
});

emitter.on('every_minute', () => {
  console.log(now(), "==> EVENT: A minute has passed");
});

emitter.on('every_five_minutes', () => {
  console.log(now(), "==> EVENT: Five minutes has passed");
});

emitter.on('every_thirty_minutes', () => {
  console.log(now(), "==> EVENT: Thirty minutes has passed");
});

const increment = (counter = 0) => (counter + 1);
let counter = 0;

emitter.on("every_second_stop", () => {
  counter = increment(counter);
  console.log(now(), "==> EVENT: got every second event: ", counter);
});

emitter.on('every_two_seconds', () => {
  console.log(now(), "==> EVENT: got every two seconds event.");
});
```
