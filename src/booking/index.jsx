'use client';
import { useState } from 'react';
import BookingLayout from './BookingLayout';
import ProgressHeader from './ProgressHeader';
import StepFooter from './StepFooter';
import StepContainer from './StepContainer';
import ZipStep from './ZipStep';
import VehicleStep from './VehicleStep';
import ServiceStep from './ServiceStep';
import LocationStep from './LocationStep';
import ScheduleStep from './ScheduleStep';
import ContactStep from './ContactStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import ConfirmationStep from './ConfirmationStep';

const STEPS = ['Zip Code', 'Vehicle', 'Service', 'Location', 'Schedule', 'Contact', 'Payment', 'Review', 'Confirmation'];
const STEP_COMPONENTS = [ZipStep, VehicleStep, ServiceStep, LocationStep, ScheduleStep, ContactStep, PaymentStep, ReviewStep, ConfirmationStep];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  function handleNext() {
    if (!isLast) setCurrentStep(s => s + 1);
  }

  function handleBack() {
    if (!isFirst) setCurrentStep(s => s - 1);
  }

  function handleUpdate(field, value) {
    setData(d => ({ ...d, [field]: value }));
  }

  return (
    <BookingLayout>
      <ProgressHeader currentStep={currentStep} steps={STEPS} />
      <StepContainer>
        <StepComponent data={data} onUpdate={handleUpdate} />
      </StepContainer>
      {!isLast && <StepFooter onNext={handleNext} onBack={handleBack} />}
    </BookingLayout>
  );
}
