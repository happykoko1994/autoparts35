import connectDB from "../../lib/db";
import Order from "../../models/Order";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    await connectDB();

    // Валидация данных
    const schema = z.object({
      name: z.string().min(2, "Имя слишком короткое"),
      email: z.string().email("Некорректный email"),
      vin: z.string().optional(),
      message: z.string().optional(),
      fileUrl: z.string().optional(), // Теперь мы принимаем URL, а не файл
    });

    const data = schema.parse(req.body);

    console.log("Данные перед сохранением в базу:", data);

    // Сохранение заказа в базу
    const order = new Order(data);
    await order.save();

    res
      .status(201)
      .json({ message: "Заказ успешно отправлен", fileUrl: data.fileUrl });

    console.log("✅ Заказ успешно сохранён в базе, файл:", data.fileUrl);

    // Отправляем email (асинхронно)
    sendEmailNotification(data).catch(console.error);
  } catch (error) {
    console.error("❌ Ошибка при сохранении заказа:", error);
    res.status(400).json({ message: error.message });
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
