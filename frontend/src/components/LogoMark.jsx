export function LogoMark({ compact = false }) {
  return (
    <div className={`logo-mark${compact ? " logo-mark--compact" : ""}`} aria-label="TaskFlow">
      <span className="logo-mark__glyph">TF</span>
      {!compact && <span className="logo-mark__word">TaskFlow</span>}
    </div>
  );
}
