
import express from 'express'
import taskRoutes from './routes/task.routes.js'
import authRoute from './routes/auth.routes.js'
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', taskRoutes);
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
    res.send(`
      <h1>Let's Get More Productive!</h1>
      `);
    });

app.listen(8800, () => {
    console.log("Server is running!");
});
