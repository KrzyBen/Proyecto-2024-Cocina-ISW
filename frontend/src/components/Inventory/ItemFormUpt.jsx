import React, { useState, useEffect } from 'react';

const ItemFormUpt = ({ itemToEdit, onSubmit }) => {
  const [itemData, setItemData] = useState({
    name: '',
    type: 'comida',
    quantity: 1,
    expirationDate: '',
    estate: 'vigente',
  });

  useEffect(() => {
    if (itemToEdit) {
      setItemData({
        name: itemToEdit.name,
        type: itemToEdit.type,
        quantity: itemToEdit.quantity,
        expirationDate: itemToEdit.expirationDate || '',
        estate: itemToEdit.estate || (itemToEdit.type === 'comida' ? 'vigente' : 'nuevo'),
      });
    }
  }, [itemToEdit]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let updatedExpirationDate = itemData.expirationDate;

    // Sumar un día si el tipo es 'comida' y se ingresó una fecha de expiración
    if (itemData.type === 'comida' && itemData.expirationDate) {
      const date = new Date(itemData.expirationDate);
      date.setDate(date.getDate() + 1);
      updatedExpirationDate = date.toISOString().split('T')[0];
    }

    // Enviar los datos actualizados al padre
    onSubmit(itemToEdit.id, { ...itemData, expirationDate: updatedExpirationDate });
  };

  const getAvailableStates = () => {
    if (itemData.type === 'comida') {
      return ['vigente', 'caducado'];
    }
    return ['nuevo', 'usado', 'dañado'];
  };

  const getTypeLabel = () => {
    switch (itemData.type) {
      case 'comida':
        return 'Comida';
      case 'utensilio':
        return 'Utensilio';
      case 'equipamiento':
        return 'Equipamiento';
      case 'herramienta':
        return 'Herramienta';
      default:
        return 'Desconocido';
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Nombre del Ítem:
        <input
          type="text"
          value={itemData.name}
          onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
        />
      </label>
      <label>
        Tipo:
        <span>{getTypeLabel()}</span>
      </label>
      <label>
        Cantidad:
        <input
          type="number"
          min="1"
          value={itemData.quantity}
          onChange={(e) =>
            setItemData({ ...itemData, quantity: parseInt(e.target.value, 10) })
          }
        />
      </label>
      {itemData.type === 'comida' && (
        <label>
          Fecha de Expiración:
          <input
            type="date"
            value={itemData.expirationDate}
            onChange={(e) =>
              setItemData({ ...itemData, expirationDate: e.target.value })
            }
          />
        </label>
      )}
      <label>
        Estado:
        <select
          value={itemData.estate}
          onChange={(e) => setItemData({ ...itemData, estate: e.target.value })}
        >
          {getAvailableStates().map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Actualizar Ítem</button>
    </form>
  );
};

export default ItemFormUpt;