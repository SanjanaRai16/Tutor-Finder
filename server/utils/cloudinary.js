// import { v2 as cloudinary } from "cloudinary";
// import 'dotenv/config';
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// export default cloudinary;
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: req.body.role === 'tutor' ? 'tutor' : 'student',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

export { cloudinary, storage };