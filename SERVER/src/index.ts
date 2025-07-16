import express from "express";
import connectToDatabase from "./utils/connect";
import { createdummyData, addGift } from "./utils/addTodb";
import giftRouter from "./routes/giftRouter";
import authR from "./routes/auth";
import userRouter from "./routes/userRouter";
import cors from "cors";
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
(async () => {
  await connectToDatabase();
  await createdummyData();
})();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/gifts", giftRouter);
app.use("/auth", authR);
app.use("/user", userRouter);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
