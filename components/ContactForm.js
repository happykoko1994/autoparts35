"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../styles/form.css";
import { schema } from "../utils/validation";
import { uploadFileToCloudinary } from "../utils/uploadService";
import { useFileUpload } from "../hooks/useFileUpload";
import FileInput from "./FileInput";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const { file, fileName, handleFileChange, resetFile } = useFileUpload();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    let fileUrl = "";

    if (file) {
      try {
        const cloudinaryResponse = await uploadFileToCloudinary(file);
        fileUrl = cloudinaryResponse.url;
      } catch {
        setError("Ошибка при отправке файла на Cloudinary");
        return;
      }
    }

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fileUrl }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

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
        {errors.vin && <p className="error-message">{errors.vin.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Описание запроса</label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Опишите ваш запрос"
          className="input-field"
        />
        {errors.message && (
          <p className="error-message">{errors.message.message}</p>
        )}
      </div>

      <FileInput
        fileName={fileName}
        onChange={handleFileChange}
        onRemove={resetFile}
      />

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? <ClipLoader color="white" size={24} /> : "Отправить"}
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
