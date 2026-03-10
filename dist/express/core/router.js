"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const join_paths_1 = require("../utils/join-paths");
const Router = () => {
    const allRoutes = [];
    const router = {
        use(basePathOrMiddleware, customRouter) {
            // this is custom router==>
            if (typeof basePathOrMiddleware === 'string') {
                const prevRoutes = customRouter === null || customRouter === void 0 ? void 0 : customRouter._getRoutes();
                const updatedRoutes = prevRoutes === null || prevRoutes === void 0 ? void 0 : prevRoutes.map((item) => (Object.assign(Object.assign({}, item), { path: (0, join_paths_1.joinPaths)(basePathOrMiddleware, item === null || item === void 0 ? void 0 : item.path) })));
                return allRoutes.push(...updatedRoutes);
            }
        },
        get(path, ...handlers) {
            allRoutes.push({
                method: 'GET',
                path,
                handlers,
            });
        },
        post(path, ...handlers) {
            allRoutes.push({
                method: 'POST',
                path,
                handlers,
            });
        },
        patch(path, ...handlers) {
            allRoutes.push({
                method: 'PATCH',
                path,
                handlers,
            });
        },
        put(path, ...handlers) {
            allRoutes.push({
                method: 'PUT',
                path,
                handlers,
            });
        },
        delete(path, ...handlers) {
            allRoutes.push({
                method: 'DELETE',
                path,
                handlers,
            });
        },
        _getRoutes() {
            return allRoutes;
        },
    };
    return router;
};
exports.Router = Router;
