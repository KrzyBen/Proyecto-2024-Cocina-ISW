import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Componentes
import Table from '@components/Table';
import ItemForm from '@components/Inventory/ItemForm';
import ItemFormUpt from '@components/Inventory/ItemFormUpt';
import ItemPopup from '@components/Inventory/ItemPopup';
import Search from '@components/Search';
// Hooks
import { useCreateItem } from '@hooks/inventory/items/useCreateItems';
import { useUpdateItem } from '@hooks/inventory/items/useUpdateItem';
import { useFetchBatchItems } from '@hooks/inventory/items/useFetchBatchItems';
import { useDeleteItem } from '@hooks/inventory/items/useDeleteItem';
import { useFetchBatch } from '@hooks/inventory/batch/useFetchBatch';
// Assets
import DeleteIcon from '@assets/deleteIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import UpdateIconDisable from '@assets/updateIconDisabled.svg';
import DeleteIconDisable from '@assets/deleteIconDisabled.svg';
// Otros

const ItemsPage = () => {
  const { batchId } = useParams();

  const [filterId, setFilterId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('create');
  const [itemToEdit, setItemToEdit] = useState(null);
  const [maxItems, setMaxItems] = useState(0);

  const { items, loading, fetchBatchItems } = useFetchBatchItems(batchId);
  const { handleDelete } = useDeleteItem(fetchBatchItems);
  const { handleCreate } = useCreateItem(fetchBatchItems);
  const { handleUpdate } = useUpdateItem(fetchBatchItems);
  const { batch } = useFetchBatch(batchId);

  useEffect(() => {
    if (batch) {
      setMaxItems(batch.totalItems);
    }
  }, [batch]);

  const handleIdFilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleCreateItem = async (item) => {
    if (items.length >= maxItems) {
      alert(`No se pueden agregar más de ${maxItems} ítems al lote.`);
      return;
    }

    try {
      await handleCreate(batchId, item);
      setShowPopup(false);
    } catch (error) {
      console.error('Error al crear el item:', error);
    }
  };

  const handleUpdateItem = async (id, item) => {
    try {
      await handleUpdate(batchId, id, item);
      setShowPopup(false);
    } catch (error) {
      console.error('Error al actualizar el item:', error);
    }
  };

  const handleDeleteItem = () => {
    if (itemToEdit) {
      handleDelete(batchId, itemToEdit.id);
      setItemToEdit(null);
    }
  };

  const columns = [
    { title: 'ID del Ítem', field: 'id', width: 150, responsive: 2 },
    { title: 'Nombre', field: 'name', width: 250, responsive: 2 },
    { title: 'Cantidad', field: 'quantity', width: 200, responsive: 3 },
    { title: 'Tipo', field: 'type', width: 150, responsive: 4 },
    { title: 'Estado', field: 'estate', width: 150, responsive: 4 },
    { title: 'Fecha de Vencimiento', field: 'expirationDate', width: 200, responsive: 4 },
  ];

  const handleSelectionChange = useCallback((selectedRows) => {
    if (selectedRows.length > 0) {
      setItemToEdit(selectedRows[0]);
    } else {
      setItemToEdit(null);
    }
  }, []);

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Items del Lote {batchId}</h1>
          <div className="filter-actions">
            <Search
              value={filterId}
              onChange={handleIdFilterChange}
              placeholder="Filtrar por ID"
              style={{ width: '150px' }}
            />
            <button
              onClick={() => {
                setPopupMode('create');
                setShowPopup(true);
              }}
              style={{ marginRight: '10px' }}
            >
              Crear Ítem
            </button>
            <button
              onClick={() => {
                setPopupMode('update');
                setShowPopup(true);
              }}
              disabled={!itemToEdit}
              style={{ marginRight: '10px' }}
            >
              <img src={itemToEdit ? UpdateIcon : UpdateIconDisable} alt="update" />
            </button>
            <button
              onClick={handleDeleteItem}
              disabled={!itemToEdit}
              style={{ marginRight: '70px' }}
            >
              <img src={itemToEdit ? DeleteIcon : DeleteIconDisable} alt="delete" />
            </button>
          </div>
        </div>
        {loading ? <p>Cargando...</p> : null}
        <Table
          data={items}
          columns={columns}
          filter={filterId}
          dataToFilter="id"
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <ItemPopup show={showPopup} setShow={setShowPopup} className={showPopup ? 'show' : ''}>
        {popupMode === 'create' ? (
          <ItemForm batchId={batchId} onSubmit={handleCreateItem} />
        ) : (
          <ItemFormUpt batchId={batchId} itemToEdit={itemToEdit} onSubmit={handleUpdateItem} />
        )}
      </ItemPopup>
    </div>
  );
};

export default ItemsPage;