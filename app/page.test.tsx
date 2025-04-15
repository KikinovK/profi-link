import { render } from "@testing-library/react";
import Home from "./page";

it('should render the Home component correctly', () => {
  const { getByText, getByAltText } = render(<Home />);

  expect(getByAltText('Next.js logo')).toBeInTheDocument();
  expect(getByText(/Get started by editing/i)).toBeInTheDocument();
  expect(getByText('Save and see your changes instantly.')).toBeInTheDocument();
  expect(getByText('Deploy now')).toBeInTheDocument();
  expect(getByText('Read our docs')).toBeInTheDocument();
  expect(getByText('Learn')).toBeInTheDocument();
  expect(getByText('Examples')).toBeInTheDocument();
  expect(getByText('Go to nextjs.org →')).toBeInTheDocument();
});
