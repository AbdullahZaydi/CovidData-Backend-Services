import { createRequire } from "module";
import { JSONUtil } from "./JSONUtils.js";

const require = createRequire(import.meta.url);

export async function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined") {
        const ModelUtils = JSONUtil.getInstance();

        const bearerToken = bearerHeader.split(" ");
        req.token = bearerToken[1];

        const [user] = await ModelUtils.getUsers().where({ verificationToken: req.token }).value();
        if (!user) {
            res.status(401).json({
                status: "error",
                message: "Sorry! This token is not authorized!"
            });
        } else {
            req.user = Object.assign({}, user);
            next();
        }
    } else {
        res.status(401).json({ message: "please Insert Jwt" });
    }
}

export function paginate(records, page = 1, limit = 10) {
    const results = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (endIndex < records.length) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    results.totalPages = {
        page: Math.ceil(records.length / limit),
        limit: limit,
        totalRecords: records.length
    };

    results.result = records.slice(startIndex, endIndex);
    return results;
}

export function getModel(modelName) {
    if (typeof modelName !== "string") {
        throw new Error("Please use string as a parameter in getModel function.");
    }

    return require(`../models/${modelName}.json`);
}