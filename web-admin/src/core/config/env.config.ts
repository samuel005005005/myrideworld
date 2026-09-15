export const envConfig = {
  apiBaseUrl: (() => {
    const url = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
    if (!url) {
      throw new Error(
        'Falta VITE_API_BASE_URL. Definila en web-admin/.env',
      );
    }
    return url;
  })(),
};
