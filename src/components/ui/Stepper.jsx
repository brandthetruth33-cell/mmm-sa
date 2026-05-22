export default function Stepper({ steps, currentStep }) {
  return (
    <div className="stepper">
      {steps && steps.map((step, i) => (
        <div key={i} className={`step${i === currentStep ? ' active' : ''}`}>{step}</div>
      ))}
    </div>
  );
}
