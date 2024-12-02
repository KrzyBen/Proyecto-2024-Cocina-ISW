import React, { useState, useEffect } from 'react';
import OrderTable from '@components/OrderTable';
import OrderForm from '@components/OrderForm';
import OrderModal from '@components/OrderModal';
import { addOrder, deleteOrder, updateOrder, getOrders } from '@services/orders.service';
import '@styles/orders.css';
import Chatbot from '@components/Chatbot'; // Importando el Chatbot
import Swal from 'sweetalert2';  // Importando SweetAlert2

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false); // Estado para controlar el chatbot
  const user = JSON.parse(sessionStorage.getItem('usuario')) || null;
  const userRole = user?.rol;
  const userId = user?.id;

  const handleAddOrder = async (orderData) => {
    try {
      const newOrderData = {
        ...orderData,
        clientId: userRole === 'administrador' ? orderData.clientId : userId,
      };
      const { data: newOrder } = await addOrder(newOrderData);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleEditOrder = async (updatedData) => {
    try {
      const { data: updatedOrder } = await updateOrder(updatedData.id, updatedData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      if (selectedOrder) {
        await deleteOrder(selectedOrder.id);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrder.id));
        setIsModalOpen(false);
        setSelectedOrder(null);
      } else {
        console.error('No order selected for deletion.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const toggleChatbot = () => {
    setChatbotOpen((prevState) => !prevState); // Alternar el estado del chatbot
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        // Filtrar las órdenes según el rol del usuario
        if (userRole === 'administrador') {
          setOrders(ordersData); // Administradores ven todas las órdenes
        } else if (userRole === 'usuario') {
          const userOrders = ordersData.filter(order => order.clientId === userId);
          setOrders(userOrders); // Solo las órdenes del usuario
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [userRole, userId]);

  return (
    <div className="main-container">
      <h1>Gestión de Órdenes</h1>

      {/* Mostrar tabla con las órdenes filtradas por usuario */}
      <OrderTable
        orders={orders}
        onEdit={(order) => {
          if (userRole === 'administrador' || order.clientId === userId) {
            setSelectedOrder(order);
            setActionType('editar');
          }
        }}
        onDelete={(order) => {
          if (userRole === 'administrador' || order.clientId === userId) {
            setSelectedOrder(order);
            setActionType('eliminar');
            setIsModalOpen(true);
          }
        }}
        showActions={userRole === 'administrador'}
      />

      <OrderForm
        orderData={selectedOrder}
        onSubmit={selectedOrder ? handleEditOrder : handleAddOrder}
      />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteOrder}
        action={actionType}
      />

      {/* Ícono del chatbot flotante */}
      <div className="chatbot-container">
        <div className="chatbot-icon" onClick={toggleChatbot}>
          <img
            src="https://media.giphy.com/media/VTwDfhNOmMxZMm2iYf/giphy.gif"
            alt="Chatbot Icon"
            width="60"
            height="60"
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="chatbot-bubble">
          <span></span>
        </div>
      </div>

      {/* Integrar el Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={toggleChatbot} />
    </div>
  );
};

export default Orders;
