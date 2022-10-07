import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Reset, {
  RESET_MUTATION,
} from '../components/Reset';

const email = 'skye2@mail.com';


const mocks = [
  {
    request: {
      query: RESET_MUTATION,
      variables: { email },
    },
    result: {
      data: { sendUserPasswordResetLink: null },
    },
  },
];

describe('<Reset/>', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <Reset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mock={mocks}>
        <Reset />
      </MockedProvider>
    );
    // type into the email box
    userEvent.type(screen.getByPlaceholderText(/email/i), email);
    // click submit
    userEvent.click(screen.getByText('Request'));
    // const success = await screen.findByText(/Success/i);
    // screen.debug(success)
    // expect(success).toBeInTheDocument();
  });
});