import React, { useState } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import SickButton from "./styles/SickButton";
import nProgress from "nprogress";
import { useRouter } from "next/dist/client/router";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useCart } from "../lib/cartState";
import { CURRENT_USER_QUERY } from "./User";

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkOut(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    //stop the form from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);

    //start the page transition
    nProgress.start();

    //Create the payment method via stripe (tokens come backs here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    // Handle any error from stripes
    if (error) {
      setError(error);
      nProgress.done();
      return; //stop the chekcout if there is an error
    }
    // Send the token to keystone server via the custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    console.log(order);
    //change the page to view the order
    router.push({
      pathname: "order",
      query: { id: order.data.checkOut.id },
    });

    //close the cart
    closeCart();

    //Last part turn off loader
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check out</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
