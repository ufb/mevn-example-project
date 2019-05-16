const ENV = process.env.NODE_ENV;
const PROD = ENV === 'production';
const DEV = ENV === 'development';

module.exports = { ENV, PROD, DEV };
