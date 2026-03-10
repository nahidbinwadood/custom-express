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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUsers = exports.getUsers = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), 'src', 'app', 'data', 'users.json');
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield promises_1.default.readFile(dbPath, 'utf-8');
        return JSON.parse(users);
    }
    catch (error) {
        throw new Error(`Failed to get user data . Error:${error === null || error === void 0 ? void 0 : error.message}`);
    }
});
exports.getUsers = getUsers;
const writeUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.writeFile(dbPath, JSON.stringify(users, null, 2));
    }
    catch (error) {
        throw new Error(`Failed to write user data . Error:${error === null || error === void 0 ? void 0 : error.message}`);
    }
});
exports.writeUsers = writeUsers;
