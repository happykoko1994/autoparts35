import ContactForm from "../components/ContactForm";
import StoreInfo from "../components/StoreInfo"; // Импортируем компонент StoreInfo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="flex-grow flex flex-col md:flex-row h-full">
      <div className="w-full md:w-2/3 flex p-6">
        <StoreInfo />
      </div>
      <div className="w-full md:w-1/3 p-6 m-3 ml-0 md:ml-6 bg-white rounded-xl shadow-lg fixed top-20 bottom-20 right-0 z-10">
        <ContactForm />
      </div>
      <ToastContainer />
    </div>
  );
}

