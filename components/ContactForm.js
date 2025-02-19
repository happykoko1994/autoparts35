"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../styles/form.css";

const acceptedFormats = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const schema = z.object({
  name: z.string().min(2, "Заполните поле"),
  email: z.string().email("Некорректный email"),
  vin: z.string().optional(),
  message: z.string().optional(),
  file: z.any(),
});

const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки файла");
  }

  const result = await res.json();
  return result;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [fileName, setFileName] = useState("Файл не выбран");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // Если пользователь нажал "Отмена", сбрасываем выбранный файл
      setFile(null);
      setFileName("Файл не выбран");
      return;
    }

    if (acceptedFormats.includes(selectedFile.type)) {
      setFile(selectedFile);

      // Обрезаем длинное имя файла
      const fileName =
        selectedFile.name.length > 20
          ? selectedFile.name.slice(0, 17) +
            "..." +
            selectedFile.name.split(".").pop()
          : selectedFile.name;

      setFileName(fileName);
    } else {
      setFile(null);
      setFileName("Недопустимый формат файла");
      toast.error("Допустимые форматы: JPEG, PNG, WEBP, HEIC, HEIF");
    }
  };

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    let fileUrl = ""; // Теперь по умолчанию будет пустая строка

    if (file) {
      try {
        const cloudinaryResponse = await uploadFileToCloudinary(file);
        fileUrl = cloudinaryResponse.url;
      } catch (err) {
        setError("Ошибка при отправке файла на Cloudinary");
        return;
      }
    }

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          vin: data.vin,
          message: data.message,
          fileUrl: fileUrl || "", // Гарантируем, что будет строка
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setSuccess("Заявка отправлена!");
      toast.success("Заявка отправлена!");
    } catch (err) {
      setError(err.message);
      toast.error("Произошла ошибка при отправке");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1 className="form-title">Оставьте заявку</h1>

      <div className="form-group">
        <label htmlFor="name">Имя</label>
        <input
          id="name"
          {...register("name")}
          placeholder="Введите ваше имя"
          className="input-field"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email или телефон</label>
        <input
          id="email"
          {...register("email")}
          placeholder="Введите email или телефон"
          className="input-field"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="vin">VIN/Frame или марка и модель авто</label>
        <input
          id="vin"
          {...register("vin")}
          placeholder="Введите VIN или марку авто"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Описание запроса</label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Опишите ваш запрос"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label>Загрузите файл (изображение или видео)</label>
        <div className="custom-file-input">
          <input
            type="file"
            id="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="file" className="file-label">
            Выбрать файл
          </label>
          <span className="file-name">{fileName}</span>

          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setFileName("Файл не выбран");
              }}
              className="remove-file-button"
            >
              Удалить файл
            </button>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? <ClipLoader color="white" size={24} /> : "Отправить"}
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
