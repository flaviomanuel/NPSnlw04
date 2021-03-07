import 'reflect-metadata';
import express from 'express';
import createConnection from './database';
import { router } from './routes';

createConnection()
const app = express()
console.log('dotenv: ', process.env.NODE_ENV)

app.use(express.json())     
app.use(router)

export { app }