import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { useMyRoom } from "@/hooks/useMyRoom";

export type InvoiceStatus = "DRAFT" | "UNPAID" | "PARTIAL" | "PAID" | "CANCELED" | "OVERDUE";

export interface Invoice {
  id: number;
  contractId: number;
  fromDate: string;
  toDate: string;
  oldElectric: number;
  newElectric: number;
  oldWater: number;
  newWater: number;
  peopleCountSnapshot: number;
  rentAmount: string;
  serviceAmount: string;
  tabAmount: string;
  debtAmount: string;
  totalAmount: string;
  paidAmount: string;
  status: InvoiceStatus;
  createdAt: string;
  contract?: {
    room?: {
      roomNumber?: string;
    };
  };
}

export function useInvoices(limit = 3) {
  const { room, loading: roomLoading, error: roomError } = useMyRoom();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractId = (room as { contracts?: Array<{ id: number }> } | null)
    ?.contracts?.[0]?.id;

  const fetchInvoices = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ data: Invoice[] }>(
        "/invoice/tenant",
        { params: { contractId, limit } },
      );
      setInvoices(data.data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Không thể lấy danh sách hoá đơn!";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [contractId, limit]);

  useEffect(() => {
    if (contractId) {
      fetchInvoices();
    }
  }, [contractId, fetchInvoices]);

  return {
    invoices,
    loading: loading || roomLoading,
    error: error || roomError,
    refetch: fetchInvoices,
  };
}