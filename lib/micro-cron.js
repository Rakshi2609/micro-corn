class MicroCron {
  constructor({ tickInterval = 1000 } = {}) {
    this.tickInterval = Math.max(50, tickInterval);
    this.jobs = new Map();
    this._timer = null;
    this._running = false;
    this._nextJobId = 1;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._timer = setInterval(() => this._tick(), this.tickInterval);
  }

  stop() {
    if (!this._running) return;
    clearInterval(this._timer);
    this._timer = null;
    this._running = false;
  }

  schedule({ interval, task }) {
    if (typeof interval !== 'number' || interval <= 0) {
      throw new TypeError('interval must be a positive number in milliseconds');
    }

    if (typeof task !== 'function') {
      throw new TypeError('task must be a function');
    }

    const jobId = String(this._nextJobId++);

    const job = {
      jobId,
      interval,
      task,
      lastRun: Date.now(),
      running: false
    };

    this.jobs.set(jobId, job);
    return jobId;
  }

  cancel(jobId) {
    return this.jobs.delete(String(jobId));
  }

  list() {
    return Array.from(this.jobs.values()).map(j => ({
      jobId: j.jobId,
      interval: j.interval,
      lastRun: j.lastRun,
      running: j.running
    }));
  }

  async _tick() {
    const now = Date.now();

    for (const job of this.jobs.values()) {
      if (job.running) continue;

      const since = now - job.lastRun;

      if (since >= job.interval) {
        job.running = true;

        Promise.resolve()
          .then(() => job.task())
          .catch(err => console.error("Job error:", err))
          .finally(() => {
            job.running = false;
            job.lastRun = Date.now();
          });
      }
    }
  }
}

module.exports = MicroCron;