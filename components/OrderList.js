import { ClipLoader } from "react-spinners";

export default function OrderList({ orders, deleteOrder, deletingOrderId, setModalImage }) {
    if (orders.length === 0) {
      return <p className="text-center text-gray-500 text-lg">Заказов пока нет 😞</p>;
    }
  
    return (
      <ul className="w-full space-y-4">
        {orders.map((order) => (
          <li
            key={order._id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 flex justify-between items-center transition-all hover:shadow-md hover:bg-gray-100"
          >
            {/* Левая часть: текст */}
            <div className="flex-1">
              <p className="text-lg font-semibold">{order.name}</p>
              <p className="text-sm text-gray-500">
                {order.email} | {order.vin}
              </p>
              <p className="text-gray-600 pt-4 pr-3">{order.message || "Нет комментария"}</p>
            </div>
  
            {/* Правая часть: картинка и кнопка */}
            <div className="flex items-center space-x-3">
              {order.fileUrl && (
                order.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={order.fileUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover cursor-pointer"
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
                )
              )}
  
              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-red-500 hover:bg-red-600 text-black py-1.5 px-4 rounded-lg shadow-md active:scale-90 transition-transform duration-150 flex items-center justify-center"
                disabled={deletingOrderId === order._id}
              >
                {deletingOrderId === order._id ? <ClipLoader color="white" size={24} /> : "Удалить"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  