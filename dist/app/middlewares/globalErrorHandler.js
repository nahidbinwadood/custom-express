"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../errorHelpers/appError");
const sendResponse_1 = require("../helpers/sendResponse");
const globalErrorHandler = (error, req, res, next) => {
    try {
        let statusCode = 500;
        let message = 'Something Went Wrong';
        if (error instanceof appError_1.AppError) {
            statusCode = error.statusCode;
            message = error.message;
        }
        // send response==>
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode,
            message,
        });
    }
    catch (error) { }
};
exports.default = globalErrorHandler;
