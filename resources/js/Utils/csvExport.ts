/**
 * Exports data to a CSV file.
 * 
 * @param data Array of arrays, where each inner array is a row.
 * @param filename Name of the file without extension.
 * @param headers Array of strings for the CSV header.
 */
export const exportToCSV = (data: (string | number)[][], filename: string, headers: string[]) => {
  const escapeCSV = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...data.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  // Add BOM for UTF-8 (Excel likes this)
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
