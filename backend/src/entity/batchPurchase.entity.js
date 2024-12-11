"use strict";
import { EntitySchema } from "typeorm";

const purchaseBatchSchema = new EntitySchema({
  name: "PurchaseBatch",
  tableName: "purchase_batches",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    acquisitionDate: {
      type: "date",
      nullable: false,
    },
    totalItems: {
      type: "int",
      nullable: false,
    },
    originPurchase:{
      type: "varchar",
      length: 20,
      nullable: false,
    },
  },
  relations: {
    items: {
      type: "one-to-many",
      target: "BatchItem", 
      inverseSide: "batch",
      cascade: false,
    },
  },
});

export default purchaseBatchSchema;