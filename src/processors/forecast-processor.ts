import { ForecastNextDaysDto, ForecastTodayDto } from "../controllers/forecast";
import { database } from "../database/database";
import { IProcessor } from "../queue/processor";
import { IJob, IQueue } from "../queue/queue";
import { IForecast } from "../services/forecast/forecast";

export class ForecastTodayProcessor extends IProcessor {
    constructor(queue: IQueue, private forecastService: IForecast) {
        super(queue);
        this.queue = queue;
    }
    async start() {
        this.lyfeCycle();

        return this.queue.process(async (job, done) => {
            try {
                const city = job.data;
                const forecast = await this.forecastService.getForecastForCity(
                    city
                );
                database.forecast.push(forecast);
                done(null, forecast);
            } catch (error) {
                done(error);
            }
        });
    }
}

export class ForecastNextDaysProcessor extends IProcessor {
    constructor(
        queue: IQueue<ForecastNextDaysDto>,
        private forecastService: IForecast
    ) {
        super(queue);
        this.queue = queue;
    }
    async start() {
        this.lyfeCycle();

        return this.queue.process(async (job: IJob, done) => {
            try {
                const today = new Date();

                const { days, city } = job.data;

                const nextDays = Array.from(
                    { length: days },
                    (_, i) => i + 1
                ).map((num) => {
                    const nextDay = new Date(
                        today.setDate(today.getDate() + num)
                    );
                    return this.forecastService.getForecastForCity(
                        city as string,
                        nextDay.toISOString().slice(0, 10)
                    );
                });

                const forecasts = await Promise.all(nextDays);
                database.forecast.push(...forecasts);
                done(null, forecasts);
            } catch (error) {
                done(error);
            }
        });
    }
}
