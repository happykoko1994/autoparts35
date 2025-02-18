"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners"; // Лоадер из react-spinners
import "../styles/form.css";


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
  const [fileName, setFileName] = useState("");


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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1 className="form-title">Оставьте заявку</h1>

      <input {...register("name")} placeholder="Имя" className="form-input" />
      {errors.name && <p className="form-error">{errors.name.message}</p>}

      <input
        {...register("email")}
        placeholder="Email/телефон для связи"
        className="form-input"
      />
      {errors.email && <p className="form-error">{errors.email.message}</p>}

      <input
        {...register("vin")}
        placeholder="VIN/Frame или марка/модель авто"
        className="form-input"
      />

      <textarea {...register("message")} placeholder="Описание запроса" className="form-textarea" />

      <div className="form-file-wrapper">
        <input
          type="file"
          {...register("file")}
          id="file-upload"
          className="form-input-file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="form-file-label">
          Прикрепить фото
        </label>
        <span className="form-file-name">{fileName || "Файл не выбран"}</span>
      </div>
      <button type="submit" disabled={isSubmitting} className="form-button">
        {isSubmitting ? <ClipLoader color="white" size={24} /> : "Отправить"}
      </button>

      {success && <p className="form-success">{success}</p>}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
