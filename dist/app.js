"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express/core/express"));
const routes_1 = __importDefault(require("./app/routes"));
const sendResponse_1 = require("./app/helpers/sendResponse");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use(app.json());
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'User Api Server is Running',
    });
});
app.use(globalErrorHandler_1.default);
exports.default = app;
