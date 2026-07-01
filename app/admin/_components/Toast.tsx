export default function Toast({ toast }: { toast: { msg: string; type?: 'success' } | null }) {
  return (
    <div id="toast" className={toast ? `show ${toast.type ?? ''}` : ''}>
      {toast?.msg}
    </div>
  );
}
