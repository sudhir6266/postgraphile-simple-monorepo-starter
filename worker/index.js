const { run, quickAddJob } = require("graphile-worker");

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:root@localhost:5433/main";

async function main() {
    // Run a worker to execute jobs:
    const runner = await run({
        connectionString: databaseUrl,
        concurrency: 5,
        // Install signal handlers for graceful shutdown on SIGINT, SIGTERM, etc
        noHandleSignals: false,
        pollInterval: 1000,
        // you can set the taskList or taskDirectory but not both
        taskList: {
            hello: async (payload, helpers) => {
                const { name } = payload;
                helpers.logger.info(`Hello, ${name}`);
            },
        },
        // or:
        //   taskDirectory: `${__dirname}/tasks`,
    });

    // Or add a job to be executed:
    await quickAddJob(
        // makeWorkerUtils options
        { connectionString: databaseUrl },

        // Task identifier
        "hello",

        // Payload
        { name: "Bobby Tables" },
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
