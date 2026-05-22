export default function Button({ children, onClick, className, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
