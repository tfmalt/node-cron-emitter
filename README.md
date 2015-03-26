[![npm version](https://badge.fury.io/js/cron-emitter.svg)](http://badge.fury.io/js/cron-emitter)
[![Build Status](https://travis-ci.org/tfmalt/node-cron-emitter.svg?branch=master)](https://travis-ci.org/tfmalt/node-cron-emitter)
[![Code Climate](https://codeclimate.com/github/tfmalt/node-cron-emitter/badges/gpa.svg)](https://codeclimate.com/github/tfmalt/node-cron-emitter)
[![Test Coverage](https://codeclimate.com/github/tfmalt/node-cron-emitter/badges/coverage.svg)](https://codeclimate.com/github/tfmalt/node-cron-emitter)
[![Dependency Status](https://david-dm.org/tfmalt/node-cron-emitter.svg)](https://david-dm.org/tfmalt/node-cron-emitter)

## cron-emitter

Node.js event emitter that uses crontab instructions to register events 
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

This enables us to write highly decoupled and scalable code with
lower complexity per function than traditional callback driven code. We can delegate
responsibility for dealing with events to as many different subsystems as we 
want, all listening to the same event notifications.

### Install
```bash
npm install cron-emitter
```
  
### Usage
See [cron-parser](https://github.com/harrisiirak/cron-parser) for a simple 
introduction to the crontab syntax. 
If you"re on a Linux or OS X computer type
```bash
man crontab
```

### Example
```javascript
var CronEmitter = require("cron-emitter").CronEmitter;

var emitter = new CronEmitter();
var now     = new Date();

emitter.add("*/3  * * * * *", "every_three_seconds");
emitter.add("*/10 * * * * *", "every_ten_seconds");
emitter.add("0    * * * * *", "every_minute");
emitter.add("* * * * * *",    "every_second_stop", {
    endDate: new Date(now.getTime()+5500)
});

emitter.on("every_three_seconds", function() {
    "use strict";
    console.log("EVENT: Got every three seconds event.");
});

emitter.on("every_ten_seconds", function() {
    "use strict";
    console.log("EVENT: Got ten seconds event.");

    if (emitter.hasEvent("every_three_seconds")) {
        console.log("  Stopping every_three_seconds.");
        emitter.remove("every_three_seconds");
    }
});

var counter = 0;
emitter.on("every_second_stop", function() {
    "use strict";
    counter++;
    console.log("EVENT: got every second event: ", counter);
});
```
