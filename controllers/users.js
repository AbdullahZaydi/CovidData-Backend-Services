import SimpleSchema from 'simpl-schema';
import { JSONUtil } from '../utils/JSONUtils.js';

const register = async (req, res) => {
    try {
        const body = req.body,
            ModelUtils = JSONUtil.getInstance(),
            userSchema = new SimpleSchema({
                username: String,
                password: String
            }).newContext();

        if (!userSchema.validate(body)) return res.status(400).json({
            status: "error",
            message: "invalid request data"
        });

        const [exists] = await ModelUtils.getUsers().where({ username: body.username }).value();
        if (exists) return res.status(404).json({
            status: "error",
            message: "Username already exists."
        });

        const user = await ModelUtils.addUser(body).value();
        return res.json({
            status: "success",
            message: "registered user successfully!",
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const editUser = async (req, res) => {
    try {
        const body = req.body,
            ModelUtils = JSONUtil.getInstance(),
            userSchema = new SimpleSchema({
                fullName: {
                    type: String,
                    optional: true
                },
                location: {
                    type: String,
                    optional: true
                },
                username: String,
                password: String
            }).newContext();

        if (!userSchema.validate(body)) return res.status(400).json({
            status: "error",
            message: "invalid request data"
        });

        const [exists] = await ModelUtils.getUsers().where({ username: body.username }).value();
        if (!exists) return res.status(404).json({
            status: "error",
            message: "Invalid username."
        });

        const user = await ModelUtils.editUser(body).value();
        return res.json({
            status: "success",
            message: "edited user successfully!",
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const body = req.body,
            ModelUtils = JSONUtil.getInstance();
        if (!body.username || !body.password) return res.status(400).json({
            status: "error",
            message: "Invalid request data."
        });

        const [validated] = await ModelUtils.getUsers().where(body).value();
        if (!validated) return res.status(404).json({
            status: "error",
            message: "Invalid username or password."
        });

        const validatedUser = await ModelUtils.login(body).value();
        return res.json({
            status: "success",
            message: "Login Successful!",
            data: validatedUser
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const ModelUtils = JSONUtil.getInstance();
        const { username } = req.params;

        const [exists] = await ModelUtils.getUsers().where({ username }).value();
        if (!exists) return res.status(404).json({
            status: "error",
            message: "Invalid username."
        });

        await ModelUtils.deleteUser(username).value();

        return res.json({
            status: "success",
            message: `Deleted user successfully to the database.`
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

export default {
    register,
    editUser,
    loginUser,
    deleteUser
};