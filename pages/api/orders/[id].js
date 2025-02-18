import connectDB from "../../../lib/db";
import Order from "../../../models/Order";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import url from "url";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await connectDB();

    try {
      const order = await Order.findById(req.query.id);
      if (!order) return res.status(404).json({ message: "Заказ не найден" });

      // Если есть картинка, удаляем ее из Cloudinary
      if (order.fileUrl) {
        const parsedUrl = url.parse(order.fileUrl);
        const filename = path.basename(parsedUrl.pathname); // "filename.jpg"
        const publicId = filename.split(".")[0]; // "filename"
        
        console.log("Удаляем файл:", publicId); // Для отладки

        const result = await cloudinary.uploader.destroy(`uploads/${publicId}`);
        console.log("Результат удаления:", result); // Посмотрим, что вернет Cloudinary
      }

      await Order.findByIdAndDelete(req.query.id);
      res.status(200).json({ message: "Заказ и файл удалены" });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      res.status(500).json({ message: "Ошибка удаления" });
    }
  }
}
