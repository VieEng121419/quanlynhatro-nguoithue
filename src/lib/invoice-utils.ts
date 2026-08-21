/**
 * Format số tiền sang định dạng VNĐ
 * Ví dụ: 2500000 → "2.500.000 VNĐ"
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  return `${num.toLocaleString("vi-VN")} VNĐ`;
}

/**
 * Format khoảng thời gian hoá đơn từ fromDate
 * Ví dụ: "2026-07-15T10:40:40.009Z" → "Tháng 7/2026"
 */
export function formatInvoicePeriod(fromDate: string): string {
  const date = new Date(fromDate);
  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * Format ngày hết hạn từ toDate
 * Ví dụ: "2026-07-19T13:34:16.681Z" → "19/07/2026"
 */
export function formatDueDate(toDate: string): string {
  const date = new Date(toDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Ánh xạ trạng thái hoá đơn sang nhãn tiếng Việt
 */
export const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "NHÁP",
  UNPAID: "CHƯA THANH TOÁN",
  PARTIAL: "CHƯA THANH TOÁN ĐỦ",
  PAID: "ĐÃ THANH TOÁN",
  CANCELED: "ĐÃ HỦY",
  OVERDUE: "QUÁ HẠN",
  DUE: "SẮP ĐẾN HẠN",
};

/**
 * Kiểm tra hoá đơn đã quá hạn thanh toán (now > toDate)
 */
export function isOverdue(toDate: string): boolean {
  return new Date(toDate).getTime() < Date.now();
}

/**
 * Kiểm tra hoá đơn sắp đến hạn (còn trong vòng `days` ngày nữa là hết hạn)
 * Ví dụ: toDate còn cách 10 ngày → true
 */
export function isDueSoon(toDate: string, days = 10): boolean {
  const dueTime = new Date(toDate).getTime();
  const now = Date.now();
  return dueTime >= now && dueTime - now <= days * 24 * 60 * 60 * 1000;
}

/**
 * Tính trạng thái hiển thị thực tế của hoá đơn:
 * - UNPAID/PARTIAL đã quá hạn → OVERDUE
 * - UNPAID/PARTIAL còn trong vòng 10 ngày tới hạn → DUE
 * - Các trường hợp khác giữ nguyên status từ API
 */
export function getInvoiceDisplayStatus(
  status: string,
  toDate: string,
): string {
  if (status === "UNPAID" || status === "PARTIAL") {
    if (isOverdue(toDate)) return "OVERDUE";
    if (isDueSoon(toDate)) return "DUE";
  }
  return status;
}
