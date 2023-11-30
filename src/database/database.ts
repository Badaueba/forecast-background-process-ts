import { ForecastResult } from "../services/forecast/forecast";

interface Database {
    forecast: ForecastResult[];
}

export const database: Database = {
    forecast: [],
};
