import Joi from "joi";
const maxExpirationDate = new Date();
maxExpirationDate.setMonth(maxExpirationDate.getMonth() + 8);
// Validación para el cuerpo de los ítems
export const ItemBodyValidation = Joi.object({
  name: Joi.string()
    .pattern(/^(?!.*\s\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Permite tildes y evita espacios dobles
    .max(30)
    .required()
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no debe exceder los 30 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras, espacios simples y tildes.",
      "any.required": "El nombre es obligatorio.",
    }),
  type: Joi.string()
    .valid("comida", "utensilio", "equipamiento", "herramienta")
    .required()
    .messages({
      "any.only": "El tipo de ítem debe ser 'comida', 'utensilio', 'equipamiento' o 'herramienta'.",
      "any.required": "El tipo es obligatorio.",
    }),
  quantity: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.min": "La cantidad debe ser al menos 1.",
      "number.max": "No se puede agregar más de 20 ítems.",
      "any.required": "La cantidad es obligatoria.",
    }),
    expirationDate: Joi.when("type", {
      is: "comida",
      then: Joi.date()
        .greater('now')
        .less(maxExpirationDate)
        .required()
        .messages({
          "date.base": "La fecha de expiración debe ser una fecha válida.",
          "date.greater": "La fecha de expiración no puede ser en el pasado.",
          "date.less": "La fecha de expiración no puede superar los 8 meses desde hoy.",
          "any.required": "La fecha de expiración es obligatoria para alimentos.",
        }),
      otherwise: Joi.forbidden(),
    }),
  estate: Joi.string()
    .pattern(/^(?!.*\s\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Permite tildes y evita espacios dobles
    .max(15)
    .valid("nuevo", "usado", "dañado", "caducado", "vigente")
    .required()
    .messages({
      "any.only": "El estado debe ser 'nuevo', 'usado', 'dañado', 'caducado' o 'vigente'.",
      "any.required": "El estado es obligatorio.",
      "string.pattern.base": "El estado solo puede contener letras, espacios simples y tildes.",
    }),
});