// Menu.jsx
import React, { useState, useEffect } from 'react';
import MenuTable from '@components/MenuTable';
import MenuForm from '@components/MenuForm';
import MenuModal from '@components/MenuModal';
import { deleteMenuItem, getMenuItems, createMenuItem } from '../services/menu.service'; // Importando servicios
import Swal from 'sweetalert2';  // Importando SweetAlert2
import '@styles/menu.css';
import Chatbot from '@components/Chatbot'; // Importando el Chatbot

const Menu = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuItemToEdit, setMenuItemToEdit] = useState(null);
    const [menuItems, setMenuItems] = useState([]);  // Estado para los elementos del menú
    const [menuItemToDelete, setMenuItemToDelete] = useState(null); // Elemento a eliminar
    const [chatbotOpen, setChatbotOpen] = useState(false); // Estado para controlar si el chatbot está abierto
    const user = JSON.parse(sessionStorage.getItem('usuario')) || null; // Obtener usuario desde sessionStorage
    const userRole = user?.rol; // Obtener el rol del usuario

    // Cargar los elementos del menú al montar el componente
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await getMenuItems();
                setMenuItems(response); // Establecer los elementos obtenidos en el estado
            } catch (error) {
                console.error('Error al obtener los elementos del menú:', error);
            }
        };

        fetchMenuItems();
    }, []);

    // Manejar la creación de un nuevo elemento del menú
    const handleCreateMenuItem = async (menuData) => {
        if (userRole !== 'administrador' && userRole !== 'cocinero') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores y cocineros pueden agregar ítems al menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        try {
            const newMenuItem = await createMenuItem(menuData);  // Crear nuevo ítem
            setMenuItems([...menuItems, newMenuItem]); // Agregar nuevo ítem al estado
        } catch (error) {
            console.error('Error al crear un elemento del menú:', error);
        }
    };

    // Manejar la edición de un elemento del menú
    const handleEditMenuItem = (menuItem) => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden editar el menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }
        setMenuItemToEdit(menuItem);
    };

    // Manejar la eliminación de un elemento del menú
    const handleDeleteMenuItem = async () => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden eliminar ítems del menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        if (menuItemToDelete) {
            try {
                await deleteMenuItem(menuItemToDelete.id); // Eliminar ítem del backend
                setMenuItems(menuItems.filter(item => item.id !== menuItemToDelete.id)); // Eliminar ítem del estado
                setIsModalOpen(false); // Cerrar modal de confirmación de eliminación
                setMenuItemToDelete(null); // Resetear el ítem a eliminar
            } catch (error) {
                console.error('Error al eliminar el elemento del menú:', error);
            }
        }
    };

    const handleDeleteClick = (menuItem) => {
        if (userRole !== 'administrador') {
            Swal.fire({
                title: 'No tienes permisos',
                text: 'Solo los administradores pueden eliminar ítems del menú.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;  // Prevenir la eliminación si no es administrador
        }
        setMenuItemToDelete(menuItem);
        setIsModalOpen(true);  // Abrir modal para confirmar eliminación
    };

    const toggleChatbot = () => {
        setChatbotOpen(prevState => !prevState);  // Alternar el estado del chatbot
    };

    return (
        <div className="main-container">
            {/* Mostrar solo para administradores y cocineros */}
            {(userRole === 'administrador' || userRole === 'cocinero') && (
                <h2 className="title-table">Gestión de Menú</h2>
            )}

            {/* Mostrar formulario solo para administradores y cocineros */}
            {(userRole === 'administrador' || userRole === 'cocinero') && (
                <MenuForm menuItemToEdit={menuItemToEdit} onSave={handleCreateMenuItem} />
            )}

            <MenuTable 
                menuItems={menuItems} 
                onEdit={handleEditMenuItem} 
                onDelete={handleDeleteClick}  // Pasar el ítem a eliminar
                userRole={userRole}  // Pasar el rol de usuario a la tabla
            />
            <MenuModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleDeleteMenuItem}  // Llamar a la función de eliminar
            />

            {/* Ícono del chatbot con el globo de texto */}
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
                {/* Globot de ayuda */}
                <div className="chatbot-bubble">
                    <span></span>
                </div>
            </div>

            {/* Integrar el Chatbot */}
            <Chatbot isOpen={chatbotOpen} onClose={toggleChatbot} />
        </div>
    );
};

export default Menu;
