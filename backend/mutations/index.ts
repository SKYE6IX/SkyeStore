
import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkOut from './checkOut';

// make a fake graphql tagged template literal
const graphql = String.raw;

// Creating a custom mutation for adding product to cart... 
// this name is use becuse its same name for the propities we will add to our 
// Keystone config

export const extendGraphqlSchema = graphQLSchemaExtension({
    typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem,
      checkOut(token: String!): Order
    }
  `,
    resolvers: {
        Mutation: {
            addToCart,
            checkOut,
        },
    },
});