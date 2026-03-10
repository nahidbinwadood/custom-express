"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../express/core/router");
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const router = (0, router_1.Router)();
router.use('/users', user_routes_1.default);
exports.default = router;
