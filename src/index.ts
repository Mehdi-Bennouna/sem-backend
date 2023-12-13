import express from "express";
import path from "path";
import "dotenv/config";

import userRouter from "./routes/user.router";
import postRouter from "./routes/post.router";

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/healthcheck", (req, res) => {
	res.sendStatus(200);
});

app.use("/", express.static(path.join(__dirname, "..", "images")));

app.use("/users", userRouter);
app.use("/post", postRouter);

app.listen(port, () => {
	console.log("app listening on port 3000");
});
