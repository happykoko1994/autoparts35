import ContactForm from "../components/ContactForm";
import StoreInfo from "../components/StoreInfo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col md:flex-row h-full">
      {/* Контентный блок (на ПК - слева, на мобилке - растянут) */}
      <div className="w-full md:w-2/3 flex flex-col p-6">
        <StoreInfo />
      </div>

      {/* Форма обратной связи (на ПК - справа фиксированная, на мобилке - статичная) */}
      <div className="w-full md:w-1/3 p-6 md:m-3 md:ml-0 md:ml-6 bg-white rounded-xl shadow-lg md:fixed md:top-20 md:bottom-0 md:right-0 md:z-10">
        <ContactForm />
      </div>

      <ToastContainer />
    </div>
  );
}

