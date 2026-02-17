export function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value;
}
