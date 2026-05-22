export function calculateProvisionalTotal({ services = [], discount = 0 } = {}) {
  const subtotal = services.reduce((sum, service) => {
    const labor = service.laborCost || 0;
    const parts = service.partsCost || 0;
    return sum + labor + parts;
  }, 0);
  const total = subtotal - discount;
  return Math.max(0, Math.round(total * 100) / 100);
}
