import { render, screen } from '@testing-library/react';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  it('renders children when isOpen is true', () => {
    render(<Modal isOpen={true}><p>Modal Content</p></Modal>);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render children when isOpen is false', () => {
    render(<Modal isOpen={false}><p>Modal Content</p></Modal>);
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('applies modal class to container', () => {
    render(<Modal isOpen={true}><p>Content</p></Modal>);
    expect(document.querySelector('.modal')).toBeInTheDocument();
  });
});
