import express from "express";
import db from "../db";

const router = express.Router();

router.post("/register", async (req, res) => {
	const { username, password, avatar } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: "username and password required" });
	}

	const duplicate = await db.user.findFirst({
		where: { username },
	});

	if (duplicate) {
		res.status(409).json({ message: "username already in use" });
	}

	try {
		await db.user.create({
			data: { username, password, avatar: avatar ? avatar : "" },
		});
		res.status(201).json({ message: "account created" });
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: "username and password required" });
	}

	const foundUser = await db.user.findUnique({ where: { username } });

	if (!foundUser) {
		res.status(404).json({ message: "user not found" });
	}

	if (foundUser?.password !== password) {
		res.status(401).json({ message: "wrong credentials" });
	}

	res.status(201).json({
		message: "logged in successfully",
		user: foundUser,
	});
});

router.get("/", async (_req, res) => {
	const users = await db.user.findMany();

	res.status(200).json(users);
});

export default router;
