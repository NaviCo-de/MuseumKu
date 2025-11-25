// GANTI DENGAN PUNYAMU
const CLOUD_NAME = "dajagnybx"; 
const UPLOAD_PRESET = "museumku_preset"; // Pastikan mode 'Unsigned'

export const uploadToCloudinary = async (imageUri: string) => {
  if (!imageUri) return null;

  try {
    const data = new FormData();
    
    // React Native butuh objek spesifik ini untuk file
    // @ts-ignore
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg', 
      name: 'upload.jpg'
    });

    data.append('upload_preset', UPLOAD_PRESET);

    // Tembak langsung ke API Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );

    const result = await response.json();

    if (result.secure_url) {
      return result.secure_url; // Ini URL gambar yang siap disimpan di DB
    } else {
      throw new Error("Gagal upload ke Cloudinary");
    }

  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};