/**
 * Show validation errors message.
 *
 * @param   {Object}  fields
 * @param   {Object}  errors
 *
 * @return  {void}
 */
const showValidationErrors = (fields, errors) => {
  const errorsFields = Object.keys(errors)

  for (const field in fields) {
    if (errorsFields.includes(field)) {
      fields[field] = errors[field][0]
    } else {
      fields[field] = null
    }
  }
}

/**
 * Hide Validation Errors.
 *
 * @var {Object}
 */
const hideValidationErrors = fields => {
  Object.keys(fields).map(fieldName => (fields[fieldName] = null))
}

export { showValidationErrors, hideValidationErrors }
