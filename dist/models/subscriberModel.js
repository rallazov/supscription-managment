"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.createSubscriber = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure environment variables are loaded
console.log('Environment variables:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
// Don't log the password for security reasons
const poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
};
console.log('Pool configuration:', Object.assign(Object.assign({}, poolConfig), { password: '[REDACTED]' // Don't log the actual password
 }));
const pool = new pg_1.Pool(poolConfig);
exports.pool = pool;
// Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    }
    else {
        console.log('Successfully connected to the database');
        release();
    }
});
const createSubscriber = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('A. Entering createSubscriber function');
    const query = 'INSERT INTO subscribers (email, subscriptionDate, status) VALUES ($1, NOW(), $2)';
    try {
        console.log(`B. Attempting to insert email: ${email}`);
        yield pool.query(query, [email, 'active']);
        console.log(`C. Successfully inserted email: ${email}`);
    }
    catch (error) {
        console.log('D. Caught an error in createSubscriber');
        console.error('Error in createSubscriber:', error);
        if (error instanceof Error) {
            console.log(`E. Error details: ${error.name}, ${error.message}`);
            if (error.code === '23505') {
                console.log('F. Duplicate key error detected');
                throw new Error('Email already exists');
            }
        }
        console.log('G. Re-throwing the error');
        throw error;
    }
    console.log('H. Exiting createSubscriber function');
});
exports.createSubscriber = createSubscriber;
