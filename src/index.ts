import express from "express";
import forecast from "./routes/forecast";

const app = express();
app.use(express.json());

app.use("/forecast", forecast);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
