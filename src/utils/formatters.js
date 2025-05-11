export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  // Assuming input is YYYY-MM-DD from date picker
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString; // Return original if not in expected format
  return `${day}/${month}/${year}`;
};

export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  // Assuming input is DD/MM/YYYY
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return dateString; // Return original if not in expected format
  return `${year}-${month}-${day}`;
};