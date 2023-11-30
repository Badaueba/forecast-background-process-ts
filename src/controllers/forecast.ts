import { database } from "../database/database";
import { ForecastProcessor } from "../processors/forecast-processor";
import { BullQueue } from "../queue/bull-queue/bull-queue";
import { IForecast } from "./../services/forecast/forecast";
import { Request, Response } from "express";

export type ForecastNextDaysDto = {
    city: string;
    days: number;
};

export class ForecastController {
    private queue: BullQueue<ForecastNextDaysDto>;
    constructor(private forecastService: IForecast) {
        this.queue = new BullQueue<ForecastNextDaysDto>("forecast-next-days");
    }

    async today(req: Request, res: Response) {
        const { city } = req.query;
        const forecast = await this.forecastService.getForecastForCity(
            city as string
        );
        res.json(forecast);
    }

    async nextDays(req: Request, res: Response) {
        const { city } = req.body;
        const { days } = req.body;
        if (days < 1 || days > 31) {
            res.status(400).json({
                message: "Days must be between 1 and 31",
            });
            return;
        }

        this.queue.add({ city, days });

        const processor = new ForecastProcessor(
            this.queue,
            this.forecastService
        );
        processor.start();

        res.json(
            `Forecast for ${city} in ${days} days started processing in background`
        );
    }

    async history(_req: Request, res: Response) {
        res.json(database.forecast);
    }
}
