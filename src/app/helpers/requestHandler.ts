import { IncomingMessage } from 'http';

/**
 *
 * @param req - Incoming Request Object
 * @returns Promise - Returns a Parsed Body
 */

export const requestHandler = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
};
