import Joi from "joi";

const today = new Date();
const twoWeeksFromNow = new Date(today);
twoWeeksFromNow.setDate(today.getDate() + 14);

export const BatchBodyValidation = Joi.object({
  acquisitionDate: Joi.date()
    .greater(today) // No permite fechas pasadas
    .less(twoWeeksFromNow) // Rango máximo de 2 semanas
    .required()
    .messages({
      "date.base": "La fecha de adquisición debe ser una fecha válida.",
      "date.greater": "La fecha de adquisición no puede ser en el pasado.",
      "date.less": "La fecha de adquisición no puede ser más de 2 semanas desde hoy.",
      "any.required": "La fecha de adquisición es obligatoria.",
    }),
  totalItems: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      "number.base": "El número de ítems debe ser un número.",
      "number.min": "Debe haber al menos un ítem en el lote.",
      "number.max": "Debe haber menos de 20 ítems en el lote.",
      "any.required": "El número de ítems es obligatorio.",
    }),
  originPurchase: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .pattern(/^(?!.*\s{2,}).*$/)
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.base": "El origen de compra debe ser un texto.",
      "string.empty": "El origen de compra no puede estar vacío.",
      "string.pattern.base": "El origen de compra solo puede contener letras, tildes, ñ y espacios simples.",
      "string.min": "El origen de compra debe tener al menos 5 caracteres.",
      "string.max": "El origen de compra no debe exceder los 20 caracteres.",
      "any.required": "El origen de compra es obligatorio.",
    }),
});