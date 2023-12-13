import path from "path";
import express from "express";
import multer from "multer";
import db from "../db";
import cuid2 from "@paralleldrive/cuid2";

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},

	filename: (req, file, cb) => {
		console.log(file);
		const filenm = cuid2.createId() + path.extname(file.originalname);
		req.body.image = filenm;
		cb(null, filenm);
	},
});

const upload = multer({ storage: storage });

router.post("/", async (req, res) => {
	const { userId, content, image } = req.body;

	if (!userId || !image) {
		return res
			.status(400)
			.json({ message: "userId and image are required" });
	}

	await db.post.create({
		data: {
			userId,
			image,
			content: content ? content : "",
		},
	});

	return res.status(201).json({ message: "post created" });
});

router.post("/upload", upload.single("image"), async (req, res) => {
	res.status(200).json({ imageId: req.body.image });
});

router.get("/", async (req, res) => {
	const posts = await db.post.findMany();

	return res.status(200).json({ posts });
});

router.put("/:postId", async (req, res) => {
	const id = req.params.postId;

	const post = await db.post.findUnique({ where: { id } });
	if (!post) {
		return res.status(404).json({ message: "post not found" });
	}

	db.post.update({ where: { id }, data: { likes: { increment: 1 } } });
	return res.sendStatus(200);
});

export default router;
