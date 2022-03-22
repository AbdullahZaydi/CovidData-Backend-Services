import express from "express";
import dotenv from 'dotenv';
import covidRoutes from "./routes/covid.js";
import countriesRoutes from "./routes/countries.js";
import { JSONUtil } from "./utils/JSONUtils.js";
import { getModel } from "./utils/helpers.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/covid", covidRoutes);
app.use("/api/countries", countriesRoutes);

app.get("/", (req, res) => res.send("Welcome to the Users API!"));
app.all("*", (req, res) => res.status(404).send("You've tried reaching a route that doesn't exist."));

app.listen(PORT, () => {
    JSONUtil.getInstance(getModel("covid"));
    console.log(`listening on: http://localhost:${PORT}`);
});