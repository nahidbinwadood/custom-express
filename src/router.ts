import { IncomingMessage, ServerResponse } from 'http';
import { joinPaths } from './utils/join-paths';

type TNext = (error?: any) => void;

type THandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: TNext
) => void;

interface IRoutes {
  path: string;
  method: string;
  handlers: THandler[];
}

export const Router = () => {
  const allRoutes: IRoutes[] = [];
  const router = {
    use(basePath: string, customRouter: any) {
      const prevRoutes = customRouter?._getRoutes();
      const updatedRoutes = prevRoutes?.map((item: any) => ({
        ...item,
        path: joinPaths(basePath, item?.path),
      }));
      allRoutes.push(...updatedRoutes);
    },

    get(path: string, ...handlers: THandler[]) {
      allRoutes.push({
        method: 'GET',
        path,
        handlers,
      });
    },
    post(path: string, ...handlers: THandler[]) {
      allRoutes.push({
        method: 'POST',
        path,
        handlers,
      });
    },
    patch(path: string, ...handlers: THandler[]) {
      allRoutes.push({
        method: 'PATCH',
        path,
        handlers,
      });
    },
    put(path: string, ...handlers: THandler[]) {
      allRoutes.push({
        method: 'PUT',
        path,
        handlers,
      });
    },
    delete(path: string, ...handlers: THandler[]) {
      allRoutes.push({
        method: 'DELETE',
        path,
        handlers,
      });
    },

    _getRoutes() {
      return allRoutes;
    },
  };

  return router;
};
