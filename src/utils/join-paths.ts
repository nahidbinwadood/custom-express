export const joinPaths = (base: string, path: string) => {
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return `${cleanBase}/${cleanPath}`;
};