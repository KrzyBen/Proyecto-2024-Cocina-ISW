import React, { useState } from 'react';

const ItemForm = ({ onSubmit }) => {
  const [itemType, setItemType] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: 1,
    expirationDate: '',
    estate: '',
  });

  const getEstateOptions = () => {
    if (newItem.type === 'comida') {
      return ['vigente', 'caducado'];
    }
    if (['utensilio', 'equipamiento', 'herramienta'].includes(newItem.type)) {
      return ['nuevo', 'usado', 'dañado'];
    }
    return [];
  };

  const handleTypeSelection = (type) => {
    setItemType(type);
    setNewItem({
      name: '',
      type,
      quantity: 1,
      expirationDate: type === 'comida' ? '' : undefined,
      estate: '',
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let updatedExpirationDate = newItem.expirationDate;

    if (newItem.type === 'comida' && newItem.expirationDate) {
      const date = new Date(newItem.expirationDate);
      date.setDate(date.getDate() + 1);
      updatedExpirationDate = date.toISOString().split('T')[0];
    }

    onSubmit({ ...newItem, expirationDate: updatedExpirationDate });
  };

  return (
    <div>
      {itemType === null ? (
        <div>
          <h2>Selecciona el tipo de ítem:</h2>
          <button onClick={() => handleTypeSelection('comida')}>Comida</button>
          <button onClick={() => handleTypeSelection('utensilio')}>Utensilio</button>
          <button onClick={() => handleTypeSelection('equipamiento')}>Equipamiento</button>
          <button onClick={() => handleTypeSelection('herramienta')}>Herramienta</button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label>
            Nombre del Ítem:
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })
              }
            />
          </label>
          {newItem.type === 'comida' && (
            <label>
              Fecha de Expiración:
              <input
                type="date"
                value={newItem.expirationDate}
                onChange={(e) =>
                  setNewItem({ ...newItem, expirationDate: e.target.value })
                }
              />
            </label>
          )}
          <label>
            Estado:
            <select
              value={newItem.estate}
              onChange={(e) =>
                setNewItem({ ...newItem, estate: e.target.value })
              }
            >
              <option value="">Selecciona un estado</option>
              {getEstateOptions().map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Crear Ítem</button>
        </form>
      )}
    </div>
  );
};

export default ItemForm;