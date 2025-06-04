export interface Receipt {
  id: string | number;
  agencyName: string;
  amount: number;
  date: string;
  stt?: number;
}

export const getReceipts = async (params: {
  agencyName?: string;
  fromDate?: string;
  minAmount?: number;
  page: number;
  perPage: number;
}): Promise<{ receipts: Receipt[]; totalPage: number; }> => {
  // Mock implementation
  console.log("API called (ReceiptSearch) with params:", params);
  return new Promise(resolve => setTimeout(() => {
    const P_PAGE = params.perPage || 10;
    const P_TOTAL_ITEMS = params.agencyName === "Không tồn tại" ? 0 : 35;
    const P_TOTAL_PAGES = Math.ceil(P_TOTAL_ITEMS / P_PAGE);
    const P_CURRENT_PAGE = Math.min(params.page, P_TOTAL_PAGES) || 1;

    const itemsOnPage = (P_CURRENT_PAGE === P_TOTAL_PAGES && P_TOTAL_ITEMS % P_PAGE !== 0) ? P_TOTAL_ITEMS % P_PAGE : P_PAGE;

    resolve({
      receipts: P_TOTAL_ITEMS === 0 ? [] : Array.from({length: itemsOnPage }, (_, i) => ({
        id: `receipt_id_${P_CURRENT_PAGE}_${i}`,
        agencyName: params.agencyName || `Phiếu Thu Đại Lý ${(P_CURRENT_PAGE - 1) * P_PAGE + i + 1}`,
        amount: (Math.random() * 4500000) + (params.minAmount || 500000) + (Math.random() * 100000),
        date: params.fromDate || new Date(Date.now() - Math.random() * 1e10).toISOString(),
      })),
      totalPage: P_TOTAL_PAGES,
    });
  }, 300));
};