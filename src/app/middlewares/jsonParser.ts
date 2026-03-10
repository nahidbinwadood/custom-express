import { IncomingMessage, ServerResponse } from 'http';
import { sendResponse } from '../helpers/sendResponse';

export const jsonParser = () => {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    let body = '';
    const method = req.method || '';

    if (['POST', 'DELETE', 'PATCH', 'PUT'].includes(method)) {
      req.on('data', (chunk: Buffer) => {
        body = body + chunk.toString();
      });

      req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          (req as any).body = parsedBody;
          next();
        } catch (error) {
          return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: 'Failed to parse json',
          });
        }
      });
    } else {
      next();
    }
  };
};
