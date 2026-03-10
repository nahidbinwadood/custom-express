export function matchRoute(
  routePath: string,
  actualPath?: string | null
): Record<string, string> | null {
  if (!actualPath) return null;

  const routeParts = routePath.split('/');
  const reqParts = actualPath.split('/');

  if (routeParts.length !== reqParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routeSegment = routeParts[i];
    const reqSegment = reqParts[i];

    if (routeSegment.startsWith(':')) {
      const key = routeSegment.slice(1);
      params[key] = reqSegment;
    } else if (routeSegment !== reqSegment) {
      return null;
    }
  }

  return params;
}
