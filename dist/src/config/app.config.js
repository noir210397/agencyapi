import express from 'express';
import allRoutes from "../routes/index";
import { errorHandler } from '../../src/middlewares/error.middleware';
import cors from '../../src/middlewares/cors.middleware';
import { notfoundHandler } from '../../src/middlewares/notfound.middleware';
const app = express();
app.use(cors);
app.use(express.json());
app.use(express.urlencoded());
// ensure zod always gets an empty object not undefined
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && req.body === undefined) {
        req.body = {};
    }
    next();
});
app.use("/api", allRoutes);
app.use(notfoundHandler);
app.use(errorHandler);
export default app;
