export function ConfirmDialog({ title, message, onCancel, onConfirm, isBusy = false }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isBusy && onCancel()}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
        <p className="eyebrow">Please confirm</p>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="button button--quiet" onClick={onCancel} disabled={isBusy} autoFocus>Cancel</button>
          <button type="button" className="button button--danger" onClick={onConfirm} disabled={isBusy}>{isBusy ? "Deleting..." : "Delete task"}</button>
        </div>
      </section>
    </div>
  );
}
