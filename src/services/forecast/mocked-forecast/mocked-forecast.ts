import { IForecast, ForecastResult } from "../forecast";

export class MockedForecast implements IForecast {
    async getForecastForCity(
        city: string,
        date?: string
    ): Promise<ForecastResult> {
        const randomTimeout = Math.floor(Math.random() * 4_000);
        return new Promise((resolve) => {
            setTimeout(
                () =>
                    resolve({
                        date: date || new Date().toISOString().slice(0, 10),
                        temperature: Math.floor(Math.random() * 30),
                        wind: Math.floor(Math.random() * 15),
                        precipitation: Math.floor(Math.random() * 10),
                        city,
                    }),
                randomTimeout
            );
        });
    }

    async getForecastForLocation(
        _lat: number,
        _lon: number
    ): Promise<ForecastResult> {
        throw new Error("Method not implemented.");
    }
}
