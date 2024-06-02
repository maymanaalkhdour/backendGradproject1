const express = require('express');
const router = express.Router();
const { Annotation, validateNewAnnotation } = require('../models/Annotation');
const { verifyTokenAndDoctor } = require('../middlewares/verifyToken');
const multer = require('multer');
const path = require("path");
const { cloudinaryUploadImage } = require('../Utils/Cloudinary');
const sharp = require('sharp'); // استيراد مكتبة sharp لضغط الصورة

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../ImageAnnotation"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Save annotation data
router.post('/:msessionid', upload.single('imageUrl'), verifyTokenAndDoctor, async (req, res) => {
    try {
        let points;
        try {
            points = JSON.parse(req.body.points); // Parse points as JSON
        } catch (jsonError) {
            return res.status(400).json({ message: 'Invalid JSON format for points' });
        }
        const { error } = validateNewAnnotation({ ...req.body, points });
        if (error) return res.status(400).json(error.details[0].message);

        // ضغط الصورة باستخدام مكتبة sharp قبل تحميلها إلى Cloudinary
        const imagePath = path.join(__dirname, `../ImageAnnotation/${req.file.filename}`);
        const compressedImageBuffer = await sharp(imagePath)
            .resize({ width: 800 }) // قم بتعديل حجم الصورة حسب الحاجة
            .toBuffer();
        
        const compressedImagePath = path.join(__dirname, `../ImageAnnotation/compressed-${req.file.filename}`);
        fs.writeFileSync(compressedImagePath, compressedImageBuffer);

        const result = await cloudinaryUploadImage(compressedImagePath);
        fs.unlinkSync(compressedImagePath); // حذف الصورة المضغوطة بعد الرفع إلى Cloudinary

        const annotation = new Annotation({
            sessionmanagingid: req.params.msessionid,
            ...req.body,
            imageUrl: {
                url: result.secure_url,
                public_id: result.public_id
            }
        });
        await annotation.save();
        res.status(201).json({ message: 'Annotation saved successfully' });
    } catch (error) {
        console.error('Error saving annotation:', error);
        res.status(500).json({ message: 'Error saving annotation' });
    }
});

// Retrieve all annotations
router.get('/', async (req, res) => {
    try {
        const annotations = await Annotation.find();
        res.status(200).json(annotations);
    } catch (error) {
        console.error('Error retrieving annotations:', error);
        res.status(500).json({ message: 'Error retrieving annotations' });
    }
});

module.exports = router;
