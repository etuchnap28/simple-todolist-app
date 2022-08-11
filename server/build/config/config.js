"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@simple-todo-cluster.pwyduzh.mongodb.net/test`;
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const ALLOWED_ORIGINS = [
    'http://localhost:1337',
    'http://localhost:8000',
    'http://localhost:3000'
];
const CORS_OPTIONS = {
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
};
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.config = {
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
};
