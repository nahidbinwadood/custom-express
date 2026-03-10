import { IncomingMessage, ServerResponse } from 'http';
import { AppError } from '../errorHelpers/appError';
import { sendResponse } from '../helpers/sendResponse';

const globalErrorHandler = (
  error: any,
  req: IncomingMessage,
  res: ServerResponse,
  next: any
) => {
  try {
    let statusCode = 500;
    let message = 'Something Went Wrong';

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
    }

    // send response==>
    sendResponse(res, {
      success: false,
      statusCode,
      message,
    });
  } catch (error) {}
};

export default globalErrorHandler;
