import { v2 as cloudinary } from 'cloudinary';


export const verifyCloudinaryConfig = async () => {
  try {

    const result = await cloudinary.api.ping();
    return {
      success: true,
      message: `Cloudinary connection successful: ${result.status}`
    };
  } catch (error) {
    console.error('Cloudinary configuration error:', error.message);
    return {
      success: false,
      message: `Cloudinary configuration error: ${error.message}`
    };
  }
};

export const uploadBuffer = async (buffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sms-uploads',
          ...options
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      uploadStream.write(buffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
