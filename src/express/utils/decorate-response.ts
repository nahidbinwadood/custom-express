import { ServerResponse } from 'http';

export function decorateFunction(res: ServerResponse) {
  // json==>
  (res as any).json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  //status==>
  (res as any).status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  //send==>
  (res as any).send = (data: string | object) => {
    res.end(typeof data === 'object' ? JSON.stringify(data) : data);
  };

  // response==>
  (res as any).redirect = (url: string) => {
    res.writeHead(302, { location: url });
    res.end();
  };
}
