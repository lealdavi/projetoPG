// funcao para forcar recalcular cache
export function getModelUrl(basePath) {
  if (import.meta.env.DEV) {
    return `${basePath}?v=${Date.now()}`;
  }
  return basePath;
}
