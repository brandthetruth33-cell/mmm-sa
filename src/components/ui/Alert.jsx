export default function Alert({ children, type }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
