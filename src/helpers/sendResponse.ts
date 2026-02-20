import { ServerResponse } from 'node:http';

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: string;
}

export const sendResponse = <T>(res: ServerResponse, data: IApiResponse<T>) => {
  res.statusCode = data.statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};
