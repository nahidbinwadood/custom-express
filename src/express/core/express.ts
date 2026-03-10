import http, { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { sendResponse } from '../../app/helpers/sendResponse';
import { joinPaths } from '../utils/join-paths';
import { matchRoute } from '../utils/match-route';
import { decorateFunction } from '../utils/decorate-response';

type TNextFunction = () => void;

type TRouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

interface IRoute {
  method: string;
  path: string;
  handlers: (TRouteHandler | TGlobalMiddleware)[];
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

    use(
      basePathOrMiddleware: string | TGlobalMiddleware | TGlobalErrorMiddleware,
      customRouter?: any
    ) {
      // this is custom router==>
      if (typeof basePathOrMiddleware === 'string') {
        const allRoutes = customRouter._getRoutes();

        const updatedRoutes = allRoutes?.map((item: any) => ({
          ...item,
          path: joinPaths(basePathOrMiddleware, item?.path),
        }));

        return routes.push(...updatedRoutes);
      }

      // global middleware==>
      if (basePathOrMiddleware.length === 4) {
        // pushing the global error in the global middleware array==>
        return globalErrorMiddlewares.push(
          basePathOrMiddleware as TGlobalErrorMiddleware
        );
      }

      // pushing the global middleware in the array==>
      return globalMiddlewares.push(basePathOrMiddleware as TGlobalMiddleware);
    },

    /**
     * Get Method
     * @param path - Route Path
     * @param handler - Route Handler
     */

    get(path: string, ...handlers: (TRouteHandler | TGlobalMiddleware)[]) {
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

    post(path: string, ...handlers: (TRouteHandler | TGlobalMiddleware)[]) {
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

    delete(path: string, ...handlers: (TRouteHandler | TGlobalMiddleware)[]) {
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

    patch(path: string, ...handlers: (TRouteHandler | TGlobalMiddleware)[]) {
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

    put(path: string, ...handlers: (TRouteHandler | TGlobalMiddleware)[]) {
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
      // update the res (json,send,status and redirect)
      decorateFunction(res);

      // run the middleware
      let index = 0;

      const next = async (err?: any) => {
        // send to global error handler==>
        if (err) {
          return await this.errorHandler(err, req, res);
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
      const query = parsedUrl.query;
      (req as any).query = query;

      const method = req.method;

      let extractedParams: Record<string, string> = {};
      const route = routes.find((item) => {
        if (item?.method !== method) return false;

        const params = matchRoute(item?.path, pathname);

        if (params !== null) {
          extractedParams = params;
          return true;
        }

        return false;
      });

      if (route) {
        (req as any).params = extractedParams;

        let index = 0;

        const next = async (error?: any) => {
          if (error) {
            return this.errorHandler(error, req, res);
          }

          if (index < route.handlers.length) {
            const handler = route.handlers[index];
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

    json() {
      return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.headers['content-type'] !== 'application/json') {
          return next();
        }

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
    },
  };

  return app;
};

export default express;
