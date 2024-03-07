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
    let cookieValue = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return cookieValue ? cookieValue.pop() : "";
  }
  return "";
}

