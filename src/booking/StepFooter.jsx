export default function StepFooter({ onNext, onBack }) {
  return (
    <footer className="step-footer">
      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </footer>
  );
}
