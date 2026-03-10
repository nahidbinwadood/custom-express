"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHandler = void 0;
/**
 *
 * @param req - Incoming Request Object
 * @returns Promise - Returns a Parsed Body
 */
const requestHandler = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            }
            catch (error) {
                reject(error);
            }
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
};
exports.requestHandler = requestHandler;
