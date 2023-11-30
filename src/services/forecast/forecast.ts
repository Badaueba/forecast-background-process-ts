export type ForecastResult = {
    date: string;
    temperature: number;
    wind: number;
    precipitation: number;
    city?: string;
};

export interface IForecast {
    getForecastForCity(city: string, date?: string): Promise<ForecastResult>;
    getForecastForLocation(lat: number, lon: number): Promise<ForecastResult>;
}
