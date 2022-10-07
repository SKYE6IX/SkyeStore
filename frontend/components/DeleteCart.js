import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import styled from "styled-components";

const DELETE_CART_MUTATION = gql`
  mutation DELETE_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const DeleteButton = styled.button`
  border: 0;
  background: none;
  font-size: 2rem;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;
// function to update the delete without using refect query
// is to evict from cache apollo itself

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function DeleteCart({ id }) {
  const [deleteCart, { loading }] = useMutation(DELETE_CART_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <DeleteButton type="button" onClick={deleteCart} disabled={loading}>
      &times;
    </DeleteButton>
  );
}
