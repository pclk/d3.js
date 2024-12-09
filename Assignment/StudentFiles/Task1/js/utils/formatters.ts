export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD'
  }).format(value);
};

export const parsePrice = (price: string): number => {
  return Number(price.replace(/[$,]/g, ''));
};

export const parseArea = (area: string): number => {
  return Number(area.replace(/,/g, ''));
};
