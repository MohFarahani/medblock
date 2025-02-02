export const LogService = {
  info: (message: string, meta?: object) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  error: (message: string, error: unknown) => {
    console.error(`[ERROR] ${message}:`, error);
  },
  debug: (message: string, meta?: object) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  }
};
