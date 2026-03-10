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
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const sendResponse_1 = require("../../app/helpers/sendResponse");
const join_paths_1 = require("../utils/join-paths");
const matchRoute_1 = require("../utils/matchRoute");
const express = () => {
    const globalMiddlewares = [];
    const globalErrorMiddlewares = [];
    const routes = [];
    /**
     * Main Application
     */
    const app = {
        /**
         * Middleware Functions
         * @param middlewares : Middleware functions | Global Error Middleware
         */
        use(basePathOrMiddleware, customRouter) {
            // this is custom router==>
            if (typeof basePathOrMiddleware === 'string') {
                const allRoutes = customRouter._getRoutes();
                const updatedRoutes = allRoutes === null || allRoutes === void 0 ? void 0 : allRoutes.map((item) => (Object.assign(Object.assign({}, item), { path: (0, join_paths_1.joinPaths)(basePathOrMiddleware, item === null || item === void 0 ? void 0 : item.path) })));
                return routes.push(...updatedRoutes);
            }
            // global middleware==>
            if (basePathOrMiddleware.length === 4) {
                // pushing the global error in the global middleware array==>
                return globalErrorMiddlewares.push(basePathOrMiddleware);
            }
            // pushing the global middleware in the array==>
            return globalMiddlewares.push(basePathOrMiddleware);
        },
        /**
         * Get Method
         * @param path - Route Path
         * @param handler - Route Handler
         */
        get(path, ...handlers) {
            routes.push({
                method: 'GET',
                path,
                handlers,
            });
        },
        /**
         * POST Method
         * @param path - Route Path
         * @param handler - Route Handler
         */
        post(path, ...handlers) {
            routes.push({
                method: 'POST',
                path,
                handlers,
            });
        },
        /**
         * DELETE Method
         * @param path - Route Path
         * @param handler - Route Handler
         */
        delete(path, ...handlers) {
            routes.push({
                method: 'DELETE',
                path,
                handlers,
            });
        },
        /**
         * PATCH Method
         * @param path - Route Path
         * @param handler - Route Handler
         */
        patch(path, ...handlers) {
            routes.push({
                method: 'PATCH',
                path,
                handlers,
            });
        },
        /**
         * PUT Method
         * @param path - Route Path
         * @param handler - Route Handler
         */
        put(path, ...handlers) {
            routes.push({
                method: 'PUT',
                path,
                handlers,
            });
        },
        /**
         * Server Listener
         * @param port - Server Port
         * @param callback - Listen Callback Function
         */
        listen(port, callback) {
            const server = http_1.default.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
                this.middlewareHandler(req, res);
            }));
            server.listen(port, () => {
                callback();
            });
        },
        middlewareHandler(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let index = 0;
                const next = (err) => __awaiter(this, void 0, void 0, function* () {
                    // send to global error handler==>
                    if (err) {
                        return yield this.errorHandler(err, req, res);
                    }
                    // run the global middlewares
                    if (index < globalMiddlewares.length) {
                        const middleware = globalMiddlewares[index];
                        index++;
                        yield middleware(req, res, next);
                    }
                    else {
                        yield this.routeHandler(req, res);
                    }
                });
                yield next();
            });
        },
        routeHandler(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const parsedUrl = url_1.default.parse(req.url || '', true);
                const pathname = parsedUrl.pathname;
                const query = parsedUrl.query;
                req.query = query;
                const method = req.method;
                let extractedParams = {};
                const route = routes.find((item) => {
                    if ((item === null || item === void 0 ? void 0 : item.method) !== method)
                        return false;
                    const params = (0, matchRoute_1.matchRoute)(item === null || item === void 0 ? void 0 : item.path, pathname);
                    if (params !== null) {
                        extractedParams = params;
                        return true;
                    }
                    return false;
                });
                if (route) {
                    req.params = extractedParams;
                    let index = 0;
                    const next = (error) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            return this.errorHandler(error, req, res);
                        }
                        if (index < route.handlers.length) {
                            const handler = route.handlers[index];
                            index++;
                            try {
                                if (handler.length === 3) {
                                    yield handler(req, res, next);
                                }
                                else {
                                    yield handler(req, res);
                                }
                            }
                            catch (error) {
                                return this.errorHandler(error, req, res);
                            }
                        }
                    });
                    yield next();
                }
                else {
                    return (0, sendResponse_1.sendResponse)(res, {
                        success: true,
                        statusCode: 404,
                        message: 'Route not found',
                    });
                }
            });
        },
        errorHandler(err, req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let index = 0;
                const next = (error) => __awaiter(this, void 0, void 0, function* () {
                    const handler = globalErrorMiddlewares[index];
                    index++;
                    if (!handler) {
                        return (0, sendResponse_1.sendResponse)(res, {
                            success: false,
                            statusCode: 400,
                            message: (error === null || error === void 0 ? void 0 : error.message) || 'Internal Server Error',
                        });
                    }
                    handler(error, req, res, next);
                });
                yield next(err);
            });
        },
        json() {
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
        },
    };
    return app;
};
exports.default = express;
