export const isValidDateDDMMYYYY = (dateString) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
  const [day, month, year] = dateString.split('/').map(Number);
  
  // Validar que el año sea de 4 dígitos y no exceda 2100
  if (String(year).length !== 4 || year > 2100) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};