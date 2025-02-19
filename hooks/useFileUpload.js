import { useState } from "react";
import { toast } from "react-toastify";
import { acceptedFormats } from "../utils/validation";

export const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Файл не выбран");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setFileName("Файл не выбран");
      return;
    }

    if (acceptedFormats.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(
        selectedFile.name.length > 20
          ? `${selectedFile.name.slice(0, 17)}...${selectedFile.name.split(".").pop()}`
          : selectedFile.name
      );
    } else {
      setFile(null);
      setFileName("Недопустимый формат файла");
      toast.error("Допустимые форматы: JPEG, PNG, WEBP, HEIC, HEIF");
    }
  };

  const resetFile = () => {
    setFile(null);
    setFileName("Файл не выбран");
  };

  return { file, fileName, handleFileChange, resetFile };
};
