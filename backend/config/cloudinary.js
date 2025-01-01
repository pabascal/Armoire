import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'armoire',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => {
      const fileName = file.originalname.split('.')[0];
      return `${fileName}-${Date.now()}`;
    },
  },
});

const upload = multer({ storage: storage });

export default { storage, cloudinary: cloudinary, upload };
