import http, { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { sendResponse } from './helpers/sendResponse';

type TNextFunction = () => void;

type TRouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

interface IRoute {
  method: string;
  path: string;
  handler: (TRouteHandler | TGlobalMiddleware)[];
}

type TGlobalMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: TNextFunction
) => void;

type TGlobalErrorMiddleware = (
  error: any,
  req: IncomingMessage,
  res: ServerResponse,
  next: TNextFunction
) => void;

const express = () => {
  const globalMiddlewares: TGlobalMiddleware[] = [];
  const globalErrorMiddlewares: TGlobalErrorMiddleware[] = [];
  const routes: IRoute[] = [];

  /**
   * Main Application
   */

  const app = {
    /**
     * Middleware Functions
     * @param middlewares : Middleware functions | Global Error Middleware
     */
    use(middlewares: TGlobalMiddleware | TGlobalErrorMiddleware) {
      if (middlewares.length === 4) {
        globalErrorMiddlewares.push(middlewares as TGlobalErrorMiddleware);
      }
      globalMiddlewares.push(middlewares as TGlobalMiddleware);
    },

    /**
     * Get Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    get(path: string, ...handler: TRouteHandler[]) {
      routes.push({
        method: 'GET',
        path,
        handler,
      });
    },

    /**
     * POST Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    post(path: string, ...handler: TRouteHandler[]) {
      routes.push({
        method: 'POST',
        path,
        handler,
      });
    },

    /**
     * DELETE Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    delete(path: string, ...handler: TRouteHandler[]) {
      routes.push({
        method: 'DELETE',
        path,
        handler,
      });
    },

    /**
     * PATCH Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    patch(path: string, ...handler: TRouteHandler[]) {
      routes.push({
        method: 'PATCH',
        path,
        handler,
      });
    },

    /**
     * PUT Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    put(path: string, ...handler: TRouteHandler[]) {
      routes.push({
        method: 'PUT',
        path,
        handler,
      });
    },

    /**
     * Server Listener
     * @param port - Server Port
     * @param callback - Listen Callback Function
     */
    listen(port: number, callback: () => void) {
      const server = http.createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
          this.middlewareHandler(req, res);
        }
      );

      server.listen(port, () => {
        callback();
      });
    },

    async middlewareHandler(req: IncomingMessage, res: ServerResponse) {
      let index = 0;

      const next = async (err?: any) => {
        // send to global error handler==>
        if (err) {
          return this.errorHandler(err, req, res);
        }

        // run the global middlewares
        if (index < globalMiddlewares.length) {
          const middleware = globalMiddlewares[index];
          index++;
          await middleware(req, res, next);
        } else {
          await this.routeHandler(req, res);
        }
      };
      await next();
    },

    async routeHandler(req: IncomingMessage, res: ServerResponse) {
      const parsedUrl = url.parse(req.url || '', true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      const route = routes.find(
        (item) => item?.method === method && item?.path === pathname
      );

      if (route) {
        let index = 0;

        const next = async () => {
          if (index < route.handler.length) {
            const handler = route.handler[index];
            index++;

            try {
              if (handler.length === 3) {
                await (handler as TGlobalMiddleware)(req, res, next);
              } else {
                await (handler as TRouteHandler)(req, res);
              }
            } catch (error) {
              return this.errorHandler(error, req, res);
            }
          }
        };
        await next();
      } else {
        return sendResponse(res, {
          success: true,
          statusCode: 404,
          message: 'Route not found',
        });
      }
    },

    async errorHandler(err: any, req: IncomingMessage, res: ServerResponse) {
      let index = 0;

      const next = async (error?: any) => {
        const handler = globalErrorMiddlewares[index];
        index++;
        if (!handler) {
          return sendResponse(res, {
            success: false,
            statusCode: 400,
            message: error?.message || 'Internal Server Error',
          });
        }
        handler(error, req, res, next);
      };
      await next(err);
    },
  };

  return app;
};

export default express;
