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

    // Проверяем последнюю заявку от этого email
    const lastOrder = await Order.findOne({ email: req.body.email }).sort({ createdAt: -1 });

    if (lastOrder && Date.now() - new Date(lastOrder.createdAt).getTime() < COOLDOWN_TIME) {
      return res.status(429).json({ message: "Подождите перед повторной отправкой!" });
    }

    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ message: "Заявка отправлена!" });

  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

// 📩 Функция отправки email
async function sendEmailNotification(data) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
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

  console.log("✅ Email с заказом отправлен");
}
