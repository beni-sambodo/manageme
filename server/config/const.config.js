import dotenv from "dotenv";
dotenv.config();

const DB_URI = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET;
const MODE = process.env.MODE;
// admin configuration

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

// aws configuration
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.S3_BUCKET_REGION;
const bucket = process.env.S3_BUCKET_NAME;

const S3_CONFIG = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
};

const EMAIL_AUTH = {
  user: process.env.USER_EMAIL,
  pass: process.env.USER_PASSWORD,
};

const REDIS_SOCKET = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export {
  DB_URI,
  PORT,
  MODE,
  secret,
  S3_CONFIG,
  bucket,
  EMAIL_AUTH,
  REDIS_SOCKET,
  REDIS_PASSWORD,
  username,
  password,
};
