import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import Form from "./styles/Form";
import useForm from "../lib/useForm";
import Error from "./ErrorMessage";

 export const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
    token: token,
  });
  const [resetPassword, { data, loading, error }] = useMutation(
    RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await resetPassword();
    resetForm();
  }

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <Error error={successfulError || error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null && <p>Success!</p>}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request</button>
      </fieldset>
    </Form>
  );
}