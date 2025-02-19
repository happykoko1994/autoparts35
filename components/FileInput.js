import React from "react";

const FileInput = ({ fileName, onChange, onRemove }) => {
  return (
    <div className="form-group">
      <label>Загрузите файл (изображение или видео)</label>
      <div className="custom-file-input">
        <input type="file" id="file" onChange={onChange} hidden />
        <label htmlFor="file" className="file-label">Выбрать файл</label>
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
