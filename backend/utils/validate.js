function hasRequiredFields(data, requiredFields) {
  return requiredFields.every(field => data[field] !== undefined && data[field] !== null);
}
function removeEmptyFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value != null)
  );
}
module.exports = { hasRequiredFields ,removeEmptyFields};
