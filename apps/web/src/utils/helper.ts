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

export function logOutAction() {
  document.cookie = "palugada-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}