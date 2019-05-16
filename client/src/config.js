const ENV = process.env.NODE_ENV;
const IO_MODE = process.env.VUE_APP_IO === 'true';
const PROD = ENV === 'production';
const DEV = ENV === 'development';
const PORT = 5000;
const API_URL = `http://localhost:${PORT}/api/`;
const IO_URL = 'http://localhost:3001';

export { ENV, PROD, DEV, PORT, API_URL, IO_URL, IO_MODE };
