"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../styles/form.css";
import { schema } from "../utils/validation";
import { uploadFileToCloudinary } from "../utils/uploadService";
import { useFileUpload } from "../hooks/useFileUpload";
import FileInput from "./FileInput";

const COOLDOWN_TIME = 60 * 1000; // 60 секунд

export default function ContactForm() {
  const [lastSentTime, setLastSentTime] = useState(
    parseInt(localStorage.getItem("lastSentTime")) || 0
  );
  const [cooldown, setCooldown] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const { file, fileName, handleFileChange, resetFile } = useFileUpload();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lastSentTime) {
      const remainingTime = COOLDOWN_TIME - (Date.now() - lastSentTime);
      if (remainingTime > 0) {
        setCooldown(remainingTime);
        const interval = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }
    }
  }, [lastSentTime]);

  const onSubmit = async (data) => {
    if (cooldown > 0) {
      toast.warn(`Подождите ${Math.ceil(cooldown / 1000)} сек перед повторной отправкой`);
      // {cooldown > 0 ? `Подождите ${Math.ceil(cooldown / 1000)} сек` : ""}
      return;
    }

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

      setLastSentTime(Date.now());
      localStorage.setItem("lastSentTime", Date.now().toString());
      setCooldown(COOLDOWN_TIME);

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
        <label className="custom-label" htmlFor="name">
          Имя
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Николай"
          className="input-field"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="custom-label" htmlFor="email">
          Email или телефон
        </label>
        <input
          id="email"
          {...register("email")}
          placeholder="example@mail.com"
          className="input-field"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div className="form-group">
        <label className="custom-label" htmlFor="vin">
          VIN/Frame или марка и модель авто
        </label>
        <input
          id="vin"
          {...register("vin")}
          placeholder="XW8ZZZ61ZDG000123"
          className="input-field"
        />
        {errors.vin && <p className="error-message">{errors.vin.message}</p>}
      </div>

      <div className="form-group">
        <label className="custom-label" htmlFor="message">
          Описание запроса
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Диски тормозные передние"
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
