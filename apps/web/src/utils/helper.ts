export function formatToRupiah(number: number) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
}

export function getCookie(name: string) {
  if (typeof document !== 'undefined') {
    let cookieValue = document.cookie.match(
      '(^|;)\\s*' + name + '\\s*=\\s*([^;]+)',
    );
    return cookieValue ? cookieValue.pop() : '';
  }
  return '';
}

export const months = [
  'Last month',
  'Last 2 months',
  'Last 3 months',
  'Last 4 months',
  'Last 5 months',
  'Last 6 months',
  'Last 7 months',
  'Last 8 months',
  'Last 9 months',
  'Last 10 months',
  'Last 11 months',
  'Last 12 months',
  'Last 13 months',
  'Last 14 months',
  'Last 15 months',
  'Last 16 months',
  'Last 17 months',
  'Last 18 months',
  'Last 19 months',
  'Last 20 months',
  'Last 21 months',
  'Last 22 months',
  'Last 23 months',
  'Last 24 months',
];

export function summaryDate() {
  let arrDate = [];
  for (let i = 0; i < 12; i++) {
    arrDate.push(
      `${new Date(
        new Date().setMonth(new Date().getMonth() - (i + 1) + 1),
      ).toLocaleDateString()} - ${new Date(
        new Date().setMonth(new Date().getMonth() - (i + 1)),
      ).toLocaleDateString()}`,
    );
  }
  return arrDate;
}
