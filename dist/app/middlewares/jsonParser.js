"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonParser = void 0;
const sendResponse_1 = require("../helpers/sendResponse");
const jsonParser = () => {
    return (req, res, next) => {
        let body = '';
        const method = req.method || '';
        if (['POST', 'DELETE', 'PATCH', 'PUT'].includes(method)) {
            req.on('data', (chunk) => {
                body = body + chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);
                    req.body = parsedBody;
                    next();
                }
                catch (error) {
                    return (0, sendResponse_1.sendResponse)(res, {
                        success: false,
                        statusCode: 400,
                        message: 'Failed to parse json',
                    });
                }
            });
        }
        else {
            next();
        }
    };
};
exports.jsonParser = jsonParser;
