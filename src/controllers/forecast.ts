import { database } from "../database/database";
import {
    ForecastNextDaysProcessor,
    ForecastTodayProcessor,
} from "../processors/forecast-processor";
import { BullQueue } from "../queue/bull-queue/bull-queue";
import { IForecast } from "./../services/forecast/forecast";
import { Request, Response } from "express";
export type ForecastNextDaysDto = {
    city: string;
    days: number;
};

export type ForecastTodayDto = {
    city: string;
};

export class ForecastController {
    constructor(private forecastService: IForecast) {}

    async today(req: Request, res: Response) {
        const city = req.query.city as string;
        if (!city) return res.status(400).json("city is required");

        const queue = new BullQueue<ForecastTodayDto>("forecast-today");
        queue.add({ city });
        const processor = new ForecastTodayProcessor(
            queue,
            this.forecastService
        );
        processor.start();

        res.json(`Forecast for ${city} started processing in background`);
    }

    async nextDays(req: Request, res: Response) {
        const { city } = req.body;
        const { days } = req.body;
        if (!days || !city || days < 1 || days > 31) {
            res.status(400).json({
                message: "Days must be between 1 and 31 and city is required",
            });
            return;
        }

        const queue = new BullQueue<ForecastNextDaysDto>("forecast-next-days");

        queue.add({ city, days });

        const processor = new ForecastNextDaysProcessor(
            queue,
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
