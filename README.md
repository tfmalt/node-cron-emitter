## node-cron-emitter

Node.js event emitter that uses crontab instructions to register events 
to be emitted. This module uses [cron-parser](https://github.com/harrisiirak/cron-parser)
parse the crontab instructions syntax. See also 
[node-cron](https://github.com/ncb000gt/node-cron) for a similar project with
a more traditional node.js callback approach.

The main difference between this Library and 
[node-cron](https://github.com/ncb000gt/node-cron) is that this library aims 
to implement the event listener pattern, to achieve capabilities found in the
[Observer Pattern](http://en.wikipedia.org/wiki/Observer_pattern) and the
[PUB/SUB Pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

This enables us to write highly decoupled and scalable code with
lower complexity per function than traditional callback driven code. We can delegate
responsibility for dealing with events to possibly many different subsystems
all listening to the same event notifications.

### Install
```bash
npm install cron-emitter
```
  
### Usage
See [cron-parser](https://github.com/harrisiirak/cron-parser) for simple 
instructons to the crontab syntax. If you're on a Linux or OS X computer type
```bash
man crontab
```


```javascript
var cron = require('cron-emitter');

var emitter = new cron.CronEmitter();

emitter.add("*/3 * * * * *",  "every_three_seconds");
emitter.add("*/10 * * * * *", "every_ten_seconds");
emitter.add("0 * * * * *",    "every_minute");
emitter.add("0 0 0 * * *",    "at_midnight");

emitter.on('every_ten_secs', function() {
    console.log("EVENT: Got ten seconds event!");
});

emitter.on('at_midnight', function() {
    console.log("EVENT: Do something at midnight every day
});
```
