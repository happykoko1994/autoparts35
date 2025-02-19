export default function ImageModal({ modalImage, closeModal }) {
    if (!modalImage) return null;
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        onClick={closeModal}
      >
        <img src={modalImage} alt="Full Preview" className="max-w-full max-h-full object-contain cursor-pointer" />
      </div>
    );
  }
  