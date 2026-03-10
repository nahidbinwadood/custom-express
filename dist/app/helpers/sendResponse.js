"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    res.statusCode = data.statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};
exports.sendResponse = sendResponse;
