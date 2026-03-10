"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../../express/core/router");
const db_1 = require("../../helpers/db");
const sendResponse_1 = require("../../helpers/sendResponse");
const generateNewId_1 = require("../../utils/generateNewId");
const userRoutes = (0, router_1.Router)();
userRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, db_1.getUsers)();
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Users data fetched successfully',
        data: users,
    });
}));
userRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { name, email } = payload;
    if (!name || !email) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Invalid payload',
        });
    }
    try {
        const users = yield (0, db_1.getUsers)();
        const isExist = users === null || users === void 0 ? void 0 : users.find((item) => (item === null || item === void 0 ? void 0 : item.email) === payload.email);
        if (isExist) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 409,
                message: 'A User is already exists with this email',
            });
        }
        const id = (0, generateNewId_1.generateNewId)(users);
        const updatedPayload = {
            id,
            name,
            email,
        };
        users.push(updatedPayload);
        yield (0, db_1.writeUsers)(users);
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: 'User created successfully',
            data: users,
        });
    }
    catch (error) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Failed to create user',
        });
    }
}));
userRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Id is missing',
        });
    }
    if (Number.isNaN(Number(id))) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Invalid Id is provided',
        });
    }
    const users = yield (0, db_1.getUsers)();
    const userIndex = users.findIndex((item) => (item === null || item === void 0 ? void 0 : item.id) === Number(id));
    if (userIndex === -1) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'User not found',
        });
    }
    users.splice(userIndex, 1);
    yield (0, db_1.writeUsers)(users);
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'User Deleted Successfully',
        data: users,
    });
}));
userRoutes.patch('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const payload = req.body;
    if (!id) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'User id is required',
        });
    }
    if (Number.isNaN(Number(id))) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'Invalid user id provided',
        });
    }
    const users = yield (0, db_1.getUsers)();
    const userIndex = users === null || users === void 0 ? void 0 : users.findIndex((item) => (item === null || item === void 0 ? void 0 : item.id) === Number(id));
    if (userIndex === -1) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 400,
            message: 'User Not found',
        });
    }
    users[userIndex] = Object.assign(Object.assign({}, users[userIndex]), payload);
    yield (0, db_1.writeUsers)(users);
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
        data: users,
    });
}));
exports.default = userRoutes;
