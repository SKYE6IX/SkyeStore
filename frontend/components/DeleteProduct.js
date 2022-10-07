import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

// removing the data from cache after delete from database
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading, error }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: {
        id,
      },
      update,
    }
  );
  return (
    <button
      disabled={loading}
      type="button"
      onClick={async () => {
        if (confirm("Are you sure you want to delete this product")) {
          await deleteProduct().catch((error) => alert(error.message));
        }
      }}
    >
      {children}
    </button>
  );
}
