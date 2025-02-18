import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";
require('dotenv').config();

// Конфиг Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Настройка multer для загрузки файлов
const upload = multer({ dest: "/tmp" });

export const config = {
  api: {
    bodyParser: false, // Отключаем bodyParser для загрузки файлов
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  // Используем upload.single для обработки одного файла
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Ошибка загрузки файла:", err.message); // Логируем ошибку загрузки
      return res.status(500).json({ message: "Ошибка загрузки файла", error: err.message });
    }
  
    try {
      const filePath = req.file.path;
  
      if (!filePath) {
        return res.status(400).json({ message: "Файл не был загружен" });
      }
  
      // Загружаем файл в Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "uploads",
      });
  
      // Логируем успешную загрузку
      console.log("Ответ от Cloudinary:", result);
  
      // Удаляем временный файл
      fs.unlinkSync(filePath);
  
      // Возвращаем URL файла
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Ошибка при загрузке файла в Cloudinary:", error);
      res.status(500).json({ message: "Ошибка загрузки файла", error: error.message });
    }
  });
  
}
