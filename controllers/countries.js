import jwt from 'jsonwebtoken';
import SimpleSchema from 'simpl-schema';
import { paginate } from '../utils/helpers.js';
import { JSONUtil } from '../utils/JSONUtils.js';

const getCountries = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const countries = await ModelUtils.countryList().value();

        const result = paginate(
            countries, 
            (!req.query.page ? 1 : parseInt(req.query.page)), 
            (!req.query.limit ? 10 : parseInt(req.query.limit))
        );

        return res.json({
            status: "success",
            message: `Fetched ${countries.length} from database`,
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const postCountry = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const countryName = req.params.countryName;
        const body = req.body;

        const countries = await ModelUtils.countryList().value();
        if (countries.includes(countryName)) return res.status(400).json({
            status: "error",
            message: `Sorry! We can't add any more entries against this ${countryName} name`
        });

        const countrySchema = new SimpleSchema({
            continent: String,
            location: String,
            population: Number,
            population_density: Number,
            median_age: Number,
            aged_65_older: Number,
            aged_70_older: Number,
            gdp_per_capita: Number,
            extreme_poverty: Number,
            cardiovasc_death_rate: Number,
            diabetes_prevalence: Number,
            female_smokers: Number,
            male_smokers: Number,
            handwashing_facilities: Number,
            hospital_beds_per_thousand: Number,
            life_expectancy: Number,
            human_development_index: Number
        }).newContext();

        if (!countrySchema.validate(body)) return res.status(400).json({
            status: "error",
            message: "Invalid request data! Please fill all the valid fields.",
            trace: `${countrySchema.validationErrors()}`
        })
        body.data = [];
        ModelUtils.addCountry(countryName, body).value();

        return res.json({
            status: "success",
            message: `Posted country successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const putCountry = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const countryName = req.params.countryName;
        const body = req.body;

        const countries = await ModelUtils.countryList().value();
        if (!countries.includes(countryName)) return res.status(400).json({
            status: "error",
            message: `Sorry! We don't have any entries against this ${countryName} name`
        });

        if(body.data !== undefined) return res.status(400).json({
            status: "error",
            message: "You can't update data directly."
        });

        ModelUtils.editCountry(countryName, body);

        return res.json({
            status: "success",
            message: `Edited country successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const deleteCountry = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const { countryName, date } = req.params;
        const countries = await ModelUtils.countryList().value();

        if (!countries.includes(countryName)) return res.status(404).json({
            status: "error",
            message: `Sorry! We don't have any data available for this specific country ${countryName}`
        });

        ModelUtils.deleteCountry(countryName).value();

        return res.json({
            status: "success",
            message: `Deleted country successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

export default {
    getCountries,
    postCountry,
    putCountry,
    deleteCountry
};