import { IncomingMessage, ServerResponse } from 'http';
import express from './express';
import { jsonParser } from './middlewares/jsonParser';
import router from './routes';
import { sendResponse } from './helpers/sendResponse';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();

app.use(jsonParser());

app.use('/api/v1', router);

app.get('/', (req: IncomingMessage, res: ServerResponse) => {
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User Api Server is Running',
  });
});


app.use(globalErrorHandler)

export default app;
