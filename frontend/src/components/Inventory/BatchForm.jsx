import React, { useState } from 'react';

const BatchForm = ({ onSubmit }) => {
  const [newBatch, setNewBatch] = useState({
    acquisitionDate: '',
    totalItems: 1,
    originPurchase: '', // Nuevo campo
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const date = new Date(newBatch.acquisitionDate);
    date.setDate(date.getDate() + 1);
    const updatedDate = date.toISOString().split("T")[0];
    onSubmit({ ...newBatch, acquisitionDate: updatedDate });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Fecha de Adquisición:
        <input
          type="date"
          value={newBatch.acquisitionDate}
          onChange={(e) =>
            setNewBatch({ ...newBatch, acquisitionDate: e.target.value })
          }
        />
      </label>
      <label>
        Total de Ítems:
        <input
          type="number"
          min="1"
          max="1000"
          value={newBatch.totalItems}
          onChange={(e) =>
            setNewBatch({ ...newBatch, totalItems: parseInt(e.target.value, 10) })
          }
        />
      </label>
      <label>
        Origen de la Compra:
        <input
          type="text"
          maxLength="20"
          value={newBatch.originPurchase}
          onChange={(e) =>
            setNewBatch({ ...newBatch, originPurchase: e.target.value })
          }
        />
      </label>
      <button type="submit">Crear Lote</button>
    </form>
  );
};

export default BatchForm;