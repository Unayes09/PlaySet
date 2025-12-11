const express = require('express');
const multer = require('multer');
const { UTApi, UTFile } = require('uploadthing/server');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

router.post('/', requireAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 10 },
]), async (req, res) => {
  try {
    const images = Array.isArray(req.files?.images) ? req.files.images : [];
    const videos = Array.isArray(req.files?.videos) ? req.files.videos : [];

    const toUTFiles = (arr) => arr.map((f) => new UTFile([f.buffer], f.originalname, { type: f.mimetype }));

    const [imgResp, vidResp] = await Promise.all([
      images.length ? utapi.uploadFiles(toUTFiles(images)) : Promise.resolve([]),
      videos.length ? utapi.uploadFiles(toUTFiles(videos)) : Promise.resolve([]),
    ]);

    const safeUrl = (r) => (r && (r.url || r?.data?.url)) || null;
    const imageUrls = (Array.isArray(imgResp) ? imgResp : []).map(safeUrl).filter(Boolean);
    const videoUrls = (Array.isArray(vidResp) ? vidResp : []).map(safeUrl).filter(Boolean);

    res.json({ imageUrls, videoUrls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
