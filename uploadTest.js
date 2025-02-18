const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Настройка multer для загрузки файла
const upload = multer({ dest: './uploads' }); // Временно сохраняем файл в папке ./uploads

// Функция для загрузки файла в Cloudinary
const uploadFileToCloudinary = async (filePath) => {
  try {
    // Загружаем файл в Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'test_uploads', // Указываем папку в Cloudinary для хранения
    });
    console.log('Файл успешно загружен на Cloudinary:', result);
    return result.secure_url; // Возвращаем ссылку на загруженный файл
  } catch (error) {
    console.error('Ошибка загрузки файла на Cloudinary:', error);
  }
};

// Пример обработки загрузки файла и его отправки на Cloudinary
const testUpload = async () => {
  const filePath = path.join(__dirname, 'test.jpg'); // Путь к тестовому файлу (укажите свой путь к файлу)

  if (!filePath) {
    console.log('Файл не найден');
    return;
  }

  // Загружаем файл на Cloudinary
  const fileUrl = await uploadFileToCloudinary(filePath);
  console.log('Ссылка на загруженный файл:', fileUrl);
};

// Запуск теста
testUpload();
