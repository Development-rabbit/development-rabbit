import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server (frontend/)
  "https://03513a754a94457087e64f8efb06c757-br-c470a8da8cbb46f7954e62e87.fly.dev",
  "https://builder.io/app/projects/f25eac5ccded46f5baaa0ad55feac9bc" // 👈 add the real origin here
];

app.use(cors({

  origin: (origin, callback) => {

    // allow server-to-server or tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(requestIp.mw());


//routes import
import userRouter from './routes/user.routes.js'
import courseRoutes from "./routes/course.routes.js";
import contentRoutes from "./routes/content.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import progressRoutes from "./routes/progress.routes.js";


//routes declaration
app.use('/api/v1/users',userRouter)
// course routes handle their own per-route auth (mix of public/verifyJwt/isAdmin)
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/progress', progressRoutes);


app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

export { app }
