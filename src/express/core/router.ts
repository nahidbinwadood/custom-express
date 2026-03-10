import { IncomingMessage, ServerResponse } from 'http';
import { joinPaths } from '../utils/join-paths';

type TNext = (error?: any) => void;

type THandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: TNext
) => void;

type TRouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

interface IRoutes {
  path: string;
  method: string;
  handlers: THandler[];
}

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next?: TNext
) => void;

export const Router = () => {
  const allRoutes: IRoutes[] = [];

  const routerMiddlewares: Middleware[] = [];

  const router = {
    use(basePathOrMiddleware: string | Middleware, customRouter?: any) {
      // this is custom router==>
      if (typeof basePathOrMiddleware === 'string') {
        const prevRoutes = customRouter?._getRoutes();
        const updatedRoutes = prevRoutes?.map((item: any) => ({
          ...item,
          path: joinPaths(basePathOrMiddleware, item?.path),
        }));

        return allRoutes.push(...updatedRoutes);
      }

      // save to router middleware==>
      if (typeof basePathOrMiddleware === 'function') {
        routerMiddlewares.push(basePathOrMiddleware);
      }
    },

    get(path: string, ...handlers: (THandler | TRouteHandler)[]) {
      allRoutes.push({
        method: 'GET',
        path,
        handlers,
      });
    },
    post(path: string, ...handlers: (THandler | TRouteHandler)[]) {
      allRoutes.push({
        method: 'POST',
        path,
        handlers,
      });
    },
    patch(path: string, ...handlers: (THandler | TRouteHandler)[]) {
      allRoutes.push({
        method: 'PATCH',
        path,
        handlers,
      });
    },
    put(path: string, ...handlers: (THandler | TRouteHandler)[]) {
      allRoutes.push({
        method: 'PUT',
        path,
        handlers,
      });
    },
    delete(path: string, ...handlers: (THandler | TRouteHandler)[]) {
      allRoutes.push({
        method: 'DELETE',
        path,
        handlers,
      });
    },

    _getRoutes() {
      if (routerMiddlewares.length === 0) return allRoutes;

      return allRoutes?.map((route) => ({
        ...route,
        handlers: [...routerMiddlewares, ...route.handlers],
      }));
    },
  };

  return router;
};
