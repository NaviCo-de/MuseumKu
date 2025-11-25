// Ganti dengan data akunmu
const CLOUD_NAME = "dajagnybx"; 
const UPLOAD_PRESET = "Unsigned"; // Yg tadi mode 'Unsigned'

export const uploadToCloudinary = async (imageUri: string) => {
  if (!imageUri) return null;

  try {
    // 1. Siapkan 'Formulir' data
    const data = new FormData();
    
    // 2. Masukkan file gambar
    // React Native butuh objek khusus { uri, type, name } untuk file
    // @ts-ignore (Biar TypeScript gak rewel soal FormData di RN)
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Asumsikan jpg, atau sesuaikan
      name: 'upload.jpg'
    });

    // 3. Masukkan Preset (Kunci Pas)
    data.append('upload_preset', UPLOAD_PRESET);
    // data.append('folder', 'profile_pictures'); // Opsional: kalau mau rapi

    // 4. Tembak ke API Cloudinary
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
      // Sukses! Kembalikan link gambar (https://res.cloudinary...)
      return result.secure_url;
    } else {
      console.error("Upload Gagal:", result);
      throw new Error("Gagal upload ke Cloudinary");
    }

  } catch (error: any) {
    console.error("Error upload:", error);
    throw error;
  }
};