import { IJob, IQueue } from "./queue";

export abstract class IProcessor {
    constructor(protected queue: IQueue) {}

    abstract start(): Promise<void>;

    lyfeCycle() {
        this.queue.on("waiting", (jobId) =>
            console.log(`Job ${jobId} is waiting`)
        );

        this.queue.on("active", (job: IJob) =>
            console.log(`Job ${job.id} is active`)
        );

        this.queue.on("completed", (job: IJob, result) =>
            console.log(
                `Job ${job.id} completed with result ${JSON.stringify(result)}`
            )
        );

        this.queue.on("failed", (job: IJob, err) =>
            console.log(`Job ${job.id} failed with error ${err}`)
        );

        this.queue.on("progress", (job: IJob, progress) =>
            console.log(`Job ${job.id} reported progress: ${progress}`)
        );

        this.queue.on("removed", (job: IJob) =>
            console.log(`Job ${job.id} has been removed`)
        );

        this.queue.on("error", (err) =>
            console.log(`Queue reported error: ${err}`)
        );
    }
}
