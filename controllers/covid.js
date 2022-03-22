import jwt from 'jsonwebtoken';
import { paginate } from '../utils/helpers.js';
import { JSONUtil } from '../utils/JSONUtils.js';

const getUpdates = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();

        const countryName = req.params.countryName;
        const countries = await ModelUtils.countryList().value();

        if (!countries.includes(countryName)) return res.status(404).json({
            status: "error",
            message: `Sorry! We don't have any data available for this specific country ${countryName}`
        });

        const result = await ModelUtils.getDataByCountry(countryName).value();
        result.data = paginate(
            result.data,
            (!req.query.page ? 1 : parseInt(req.query.page)),
            (!req.query.limit ? 10 : parseInt(req.query.limit))
        )
        return res.json({
            status: "success",
            message: `Fetched updates from database`,
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const postUpdates = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const countryName = req.params.countryName;
        const countries = await ModelUtils.countryList().value();

        if (!countries.includes(countryName)) return res.status(404).json({
            status: "error",
            message: `Sorry! We don't have any data available for this specific country ${countryName}`
        });

        if (!req.body.date) return res.status(400).json({
            status: "error",
            message: "Please enter date first!"
        });

        const countryData = await ModelUtils.getDataByCountry(countryName).value();
        const doesDateExists = await ModelUtils.where({ date: req.body.date }, countryData.data).value();
        if (doesDateExists.length > 0) return res.status(400).json({
            status: "error",
            message: "We already have updates available against this data."
        });

        ModelUtils.addDataToCountry(countryName, req.body).value();

        return res.json({
            status: "success",
            message: `Posted update successfully to the database.`
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const putUpdates = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const countryName = req.params.countryName;
        const countries = await ModelUtils.countryList().value();

        if (!countries.includes(countryName)) return res.status(404).json({
            status: "error",
            message: `Sorry! We don't have any data available for this specific country ${countryName}`
        });

        if (!req.body.date) return res.status(400).json({
            status: "error",
            message: "Please enter date first!"
        });

        const countryData = await ModelUtils.getDataByCountry(countryName).value();
        const doesDateExists = await ModelUtils.where({ date: req.body.date }, countryData.data).value();
        if (doesDateExists.length === 0) return res.status(400).json({
            status: "error",
            message: "We don't have any update available on this date."
        });

        ModelUtils.editDataInCountry(countryName, req.body.date, req.body).value();

        return res.json({
            status: "success",
            message: `Edited update successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const deleteUpdates = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const { countryName, date } = req.params;
        const countries = await ModelUtils.countryList().value();

        if (!countries.includes(countryName)) return res.status(404).json({
            status: "error",
            message: `Sorry! We don't have any data available for this specific country ${countryName}`
        });

        const countryData = await ModelUtils.getDataByCountry(countryName).value();
        const doesDateExists = await ModelUtils.where({ date: date }, countryData.data).value();
        if (doesDateExists.length === 0) return res.status(400).json({
            status: "error",
            message: "We don't have any updates available on this date."
        });

        ModelUtils.deleteDataInCountry(countryName, date).value();

        return res.json({
            status: "success",
            message: `Deleted update successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

export default {
    getUpdates,
    postUpdates,
    putUpdates,
    deleteUpdates
};