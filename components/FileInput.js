import React from "react";

const FileInput = ({ fileName, onChange, onRemove }) => {
  return (
    <div className="form-group">
      <label>Загрузите изображение</label>
      <div className="custom-file-input">
        <input
          type="file"
          id="file"
          accept="image/jpeg, image/png, image/webp, image/heic, image/heif"
          onChange={onChange}
          hidden
        />
        <label htmlFor="file" className="file-label">Выбрать фото</label>
        <span className="file-name">{fileName}</span>

        {fileName !== "Файл не выбран" && (
          <button type="button" onClick={onRemove} className="remove-file-button">
            Удалить файл
          </button>
        )}
      </div>
    </div>
  );
};

export default FileInput;
