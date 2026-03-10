import { IncomingMessage, ServerResponse } from 'http';
import express from './express/core/express';
import { jsonParser } from './app/middlewares/jsonParser';
import router from './app/routes';
import { sendResponse } from './app/helpers/sendResponse';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

app.use(app.json());

app.use('/api/v1', router);

app.get('/', (req: IncomingMessage, res: ServerResponse) => {
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User Api Server is Running',
  });
});

app.use(globalErrorHandler);

export default app;
