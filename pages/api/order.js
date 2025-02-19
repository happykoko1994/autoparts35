import connectDB from "../../lib/db";
import Order from "../../models/Order";
import { z } from "zod";
import nodemailer from "nodemailer";
import { schema } from "../../utils/validation";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import url from "url";

dotenv.config();

const MAX_RECORDS = 30; // Максимальное количество заказов в базе
const COOLDOWN_TIME = 60 * 1000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    await connectDB();

    const data = schema.parse(req.body);

    console.log("📌 Данные перед сохранением в базу:", data);

    // Проверяем количество заказов
    const count = await Order.countDocuments();
    if (count >= MAX_RECORDS) {
      const oldestOrder = await Order.findOne().sort({ createdAt: 1 });

      if (oldestOrder) {
        // Удаляем изображение из Cloudinary, если есть
        if (oldestOrder.fileUrl) {
          const parsedUrl = url.parse(oldestOrder.fileUrl);
          const filename = path.basename(parsedUrl.pathname); // "filename.jpg"
          const publicId = `uploads/${filename.split(".")[0]}`; // "uploads/filename"
        
          console.log("🗑 Удаляем файл из Cloudinary:", publicId);
        
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("✔ Результат удаления файла:", result);
        
          if (result.result !== "ok") {
            console.error("⚠ Ошибка удаления файла из Cloudinary:", result);
          }
        }
        

        // Удаляем старый заказ
        await Order.deleteOne({ _id: oldestOrder._id });
        console.log("🗑 Удалена старая запись:", oldestOrder._id);
      }
    }

    // Проверяем последнюю заявку от этого email
    const lastOrder = await Order.findOne({ email: req.body.email }).sort({ createdAt: -1 });

    if (lastOrder && Date.now() - new Date(lastOrder.createdAt).getTime() < COOLDOWN_TIME) {
      return res.status(429).json({ message: "Подождите перед повторной отправкой!" });
    }

    // Сохраняем новый заказ
    const order = new Order(data);
    await order.save();

    res.status(201).json({ message: "Заказ успешно отправлен", fileUrl: data.fileUrl });
    console.log("✅ Заказ сохранён в базе, файл:", data.fileUrl);

    // Отправляем email (асинхронно)
    console.log("📩 Отправка email началась...");
    sendEmailNotification(data).catch(console.error);
      } catch (error) {
    console.error("❌ Ошибка при сохранении заказа:", error);
    res.status(400).json({ message: error.message });
  }
}

// 📩 Функция отправки email
async function sendEmailNotification(data) {
  try {
    console.log("📩 Создание транспортера...");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📩 Отправка email...");
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "Новый заказ",
      text: `Имя: ${data.name}
Обратная связь: ${data.email}
VIN: ${data.vin || "Не указан"}
Сообщение: ${data.message || "Без сообщения"}
Файл: ${data.fileUrl ? data.fileUrl : "Не загружен"}
Заказ можно посмотреть в админке: ${process.env.URL}/admin`,
    });

    console.log("✅ Email отправлен:", info.response);
  } catch (error) {
    console.error("❌ Ошибка при отправке email:", error);
  }
}

