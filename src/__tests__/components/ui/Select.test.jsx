import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '@/components/ui/Select';

describe('Select', () => {
  it('renders a select element', () => {
    render(
      <Select>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders child options', () => {
    render(
      <Select>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('can have a value selected', async () => {
    render(
      <Select defaultValue="a">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('a');
    await userEvent.selectOptions(select, 'b');
    expect(select).toHaveValue('b');
  });
});
