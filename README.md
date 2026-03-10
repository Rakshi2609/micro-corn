# micro-cron

A tiny, dependency-free in-memory cron scheduler for Node.js.

## Install

Install from npm (when published):

```bash
npm install micro-cron
```

## Usage

```javascript
const MicroCron = require('micro-cron');

const scheduler = new MicroCron();

scheduler.start();

scheduler.schedule({
  interval: 5000,
  task: () => {
    console.log('runs every 5 seconds');
  }
});
```

## API

- `new MicroCron({ tickInterval = 1000 })` – create scheduler
- `start()` – start the internal loop
- `stop()` – stop the loop
- `schedule({ interval, task })` – add a job, returns `jobId`
- `cancel(jobId)` – remove job
- `list()` – list jobs
