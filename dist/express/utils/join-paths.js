"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinPaths = void 0;
const joinPaths = (base, path) => {
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    return `${cleanBase}/${cleanPath}`;
};
exports.joinPaths = joinPaths;
