export default function ProgressHeader({ currentStep, steps }) {
  return (
    <header className="progress-header">
      <div>{steps && steps[currentStep]}</div>
      <div className="progress-bar" style={{ width: `${((currentStep + 1) / (steps?.length || 1)) * 100}%` }} />
    </header>
  );
}
