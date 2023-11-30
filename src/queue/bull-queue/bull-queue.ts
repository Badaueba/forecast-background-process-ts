import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();
import { IJob, IQueue, IQueueOptions } from "../queue";

export class BullQueue<T = any> implements IQueue {
    private bullQueue: Queue.Queue;
    constructor(private queueName: string, options?: IQueueOptions) {
        this.bullQueue = new Queue(queueName, {
            redis: {
                host: process.env.REDIS_HOST as string,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD as string,
            },
            ...(options || {}),
        });

        console.log(
            `Queue ${queueName} is running... ${process.env.REDIS_PORT}`
        );
    }

    async add(data: T, options?: Queue.JobOptions): Promise<void> {
        await this.bullQueue.add(data, options);
    }

    async process(
        callback: (job: IJob<T>, done: Function) => Promise<any>
    ): Promise<any> {
        return this.bullQueue.process(callback);
    }

    on(event: string, callback: (...args: any[]) => void): void {
        this.bullQueue.on(event, callback);
    }
}
