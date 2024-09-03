const multer = require('multer');
const path = require('path');

exports.uploadController = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: 'No file selected' });
      } else {
        const imageUrl = req.file.filename;
        return res.json({
          message: 'File uploaded successfully',
          success: true,
          data: {
            url: imageUrl,
          },
        });
      }
    }
  });
};

const storage = multer.diskStorage({
  destination: '/Users/subot/Downloads/BookStoreBack/uploads', 
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
