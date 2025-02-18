"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners"; // Лоадер из react-spinners

const schema = z.object({
  name: z.string().min(2, "Заполните поле"),
  email: z.string().email("Некорректный email"),
  vin: z.string().optional(),
  message: z.string().optional(),
  file: z.any(),
});

// Функция для загрузки файла в Cloudinary
const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки файла');
  }

  const result = await res.json(); // Получаем ответ в JSON

  console.log("Ответ от сервера:", result);

  return result; // Возвращаем URL файла
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
  
    let fileUrl = null;
  
    // Отправка файла на Cloudinary (если файл есть)
    if (data.file.length > 0) {
      const file = data.file[0];
      try {
        const cloudinaryResponse = await uploadFileToCloudinary(file);
        fileUrl = cloudinaryResponse.url;
      } catch (err) {
        setError('Ошибка при отправке файла на Cloudinary');
        return;
      }
    }
  
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // 👈 Передаём JSON
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          vin: data.vin,
          message: data.message,
          fileUrl, // 👈 Передаём уже загруженный URL
        }),
      });
  
      const result = await res.json();
      console.log("Ответ от сервера:", result);
  
      if (!res.ok) {
        throw new Error(result.message);
      }
  
      setSuccess("Заявка отправлена!");
      toast.success("Заявка отправлена!");
      console.log("Заказ успешно отправлен, путь к файлу:", result.fileUrl);
    } catch (err) {
      setError(err.message);
      console.error("Ошибка при отправке формы:", err);
      toast.error("Произошла ошибка при удалении");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-3xl text-center font-bold mb-6">Оставьте заявку</h1>

      <input {...register("name")} placeholder="Имя" className="border p-2 w-full" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input {...register("email")} placeholder="Email/телефон для связи" className="border p-2 w-full" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input {...register("vin")} placeholder="VIN/Frame или марка/модель авто" className="border p-2 w-full" />

      <textarea {...register("message")} placeholder="Описание запроса" className="border p-2 w-full" />

      <input type="file" {...register("file")} className="border p-2 w-full" />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 w-full flex items-center justify-center"
      >
        {isSubmitting ? (
          <ClipLoader color="white" size={24} /> // Показываем лоадер
        ) : (
          "Отправить"
        )}
      </button>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
