const cloudinary=require('cloudinary').v2;
const dotenv=require('dotenv');
const {CloudinaryStorage}=require('multer-storage-cloudinary');

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
    folder:'profileImages',
    allowedFormats:['jpeg','png','jpg']
    }
})

module.exports={cloudinary, storage}