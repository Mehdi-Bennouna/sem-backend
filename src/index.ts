import express from "express";
import "dotenv/config";

const port = process.env.PORT;

const app = express();
app.listen(port, () => {
	console.log("app listening on port 3000");
});

app.get("/healthcheck", (req, res) => {
	res.sendStatus(200);
});
