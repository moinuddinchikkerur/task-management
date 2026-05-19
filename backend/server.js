// // import express from 'express';
// // import cors from 'cors';
// // import 'dotenv/config';
// // import { connectDB } from './config/db.js';
// // import userRouter from './routes/userRoute.js';
// // import taskRouter from './routes/taskRoute.js';


// // const app = express();
// // const port = process.env.PORT || 4000;

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // Database connection
// // connectDB();

// // // Routes
// // app.use('/api/user/', userRouter);
// // app.use('/api/task', taskRouter);

// // app.get('/', (req, res) => {
// //     res.send('Welcome to the Task Management API');
// // })

// // app.listen(port, () => {
// //     console.log(`Server is running on http://localhost:${port}`);
// // })









// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';

// import { connectDB } from './config/db.js';

// import userRouter from './routes/userRoute.js';
// import taskRouter from './routes/taskRoute.js';

// const app = express();

// const port = process.env.PORT || 4000;

// /* ================= CORS ================= */

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// /* ================= MIDDLEWARE ================= */

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// /* ================= DATABASE ================= */

// connectDB();

// /* ================= ROUTES ================= */

// app.use('/api/user', userRouter);

// app.use('/api/task', taskRouter);

// /* ================= TEST ROUTE ================= */

// app.get('/', (req, res) => {
//   res.send('Welcome to the Task Management API');
// });

// /* ================= SERVER ================= */

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });














import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { connectDB } from './config/db.js';

import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();

const port = process.env.PORT || 4000;

/* ================= CORS ================= */

app.use(cors({
    origin: "*"
}));

/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE ================= */

connectDB();

/* ================= ROUTES ================= */

app.use('/api/user', userRouter);

app.use('/api/task', taskRouter);

/* ================= TEST ROUTE ================= */

app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API');
});

/* ================= SERVER ================= */

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});