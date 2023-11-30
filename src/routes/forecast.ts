import expres from "express";
import { ForecastController } from "../controllers/forecast";
import { MockedForecast } from "../services/forecast/mocked-forecast/mocked-forecast";

const forecastService = new MockedForecast();
const forecastController = new ForecastController(forecastService);

const router = expres.Router();
router.get("/today", (req, res) => forecastController.today(req, res));
router.post("/next-days", (req, res) => forecastController.nextDays(req, res));
router.get("/history", (req, res) => forecastController.history(req, res));

export default router;
