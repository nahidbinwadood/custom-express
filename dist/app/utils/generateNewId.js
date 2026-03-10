"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewId = void 0;
const generateNewId = (users) => {
    const maxId = users === null || users === void 0 ? void 0 : users.reduce((acc, user) => {
        return acc < (user === null || user === void 0 ? void 0 : user.id) ? user === null || user === void 0 ? void 0 : user.id : acc;
    }, 0);
    return maxId + 1;
};
exports.generateNewId = generateNewId;
