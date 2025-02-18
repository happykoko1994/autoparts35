"use client";

import "../app/globals.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners"; // Лоадер из react-spinners

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null); // Для отслеживания процесса удаления

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Ошибка при загрузке заказов");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function deleteOrder(id) {
    if (!confirm("Удалить этот заказ?")) return;

    setDeletingOrderId(id); // Устанавливаем, что сейчас удаляется заказ

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка при удалении заказа");

      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Заказ успешно удалён!");
    } catch (err) {
      toast.error(err.message || "Произошла ошибка при удалении");
    } finally {
      setDeletingOrderId(null); // Завершаем процесс удаления
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#4A90E2" size={50} />
          <p className="text-gray-500 mt-4">Загрузка заказов...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-md">
        Заказы
      </h1>

      <div className="max-w-3xl w-full bg-white p-6 mt-6 rounded-xl shadow-lg">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Заказов пока нет 😞
          </p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 flex justify-between items-center transition-all hover:shadow-md hover:bg-gray-100"
              >
                <div>
                  <p className="text-lg font-semibold">{order.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.email} | {order.vin}
                  </p>
                  <p className="text-gray-600 italic">
                    {order.message || "Нет комментария"}
                  </p>
                </div>

                {order.fileUrl && (
                  <div className="flex items-center">
                    {order.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                      <img
                        src={order.fileUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover mr-3 cursor-pointer"
                        onClick={() => setModalImage(order.fileUrl)}
                      />
                    ) : (
                      <a
                        href={order.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Открыть файл
                      </a>
                    )}
                  </div>
                )}

                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-black py-1.5 px-4 rounded-lg shadow-md active:scale-90 transition-transform duration-150 flex items-center justify-center"
                  disabled={deletingOrderId === order._id} // Блокируем кнопку, если заказ удаляется
                >
                  {deletingOrderId === order._id ? (
                    <ClipLoader color="white" size={24} /> // Лоадер на кнопке
                  ) : (
                    "Удалить"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full Preview"
            className="max-w-full max-h-full object-contain cursor-pointer"
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
