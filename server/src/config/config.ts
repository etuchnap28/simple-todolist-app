import cors from 'cors';
import dotenv from  'dotenv';
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@simple-todo-cluster.pwyduzh.mongodb.net/test`;

const SERVER_PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [ 
  'http://localhost:1337',
  'http://localhost:8000',
  'http://localhost:3000',
  'https://simple-todoo.herokuapp.com',
  'https://minh-simple-todolist.netlify.app'
];

const CORS_OPTIONS: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization'
  ],
  credentials: true,
  methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
  origin: ALLOWED_ORIGINS
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const config = {
  mongo: {
    url: MONGO_URL
  },
  server: {
    port: SERVER_PORT,
    allowedOrigins: ALLOWED_ORIGINS,
    corsOptions: CORS_OPTIONS
  },
  jwt: {
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    refreshTokenSecret: REFRESH_TOKEN_SECRET
  }
}
