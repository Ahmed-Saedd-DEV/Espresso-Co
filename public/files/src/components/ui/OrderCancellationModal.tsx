type OrderCancellationModalProps = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function OrderCancellationModal({ orderId, isOpen, onClose, onConfirm }: OrderCancellationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#231a12]/55 p-4">
      <div className="w-full max-w-lg rounded-[28px] border border-[#e8dfd5] bg-[#fff8f5] p-6 shadow-[0_30px_80px_rgba(30,20,14,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Order lifecycle</div>
            <h3 className="mt-2 font-serif text-[30px] text-[#231a12]">Cancel order</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cancellation modal"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1e8] text-[#231a12]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-6 rounded-[20px] bg-[#fff1e8] p-4 text-[#231a12]">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Selected order</div>
          <div className="mt-2 text-[20px] font-semibold">{orderId}</div>
          <p className="mt-2 text-[14px] text-[#4e4540]">
            This will release the reserved bean allocation back to the roastery inventory queue.
          </p>
        </div>

        <div className="mt-6 space-y-3 text-[15px] text-[#4e4540]">
          <label className="flex items-start gap-3 rounded-lg border border-[#e8dfd5] bg-white p-3">
            <input type="radio" name="cancelReason" defaultChecked className="mt-1 h-4 w-4 accent-[#000000]" />
            <span>I ordered by mistake and want to release the booking.</span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-[#e8dfd5] bg-white p-3">
            <input type="radio" name="cancelReason" className="mt-1 h-4 w-4 accent-[#000000]" />
            <span>I need to replace the order with a different roast selection.</span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-[#e8dfd5] bg-white p-3">
            <input type="radio" name="cancelReason" className="mt-1 h-4 w-4 accent-[#000000]" />
            <span>Other — I will contact the roastery concierge directly.</span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#231a12]">
            Keep order
          </button>
          <button type="button" onClick={() => void onConfirm()} className="rounded-lg bg-[#ba1a1a] px-4 py-2.5 text-[13px] font-semibold text-white">
            Confirm cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
