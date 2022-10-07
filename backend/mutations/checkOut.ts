import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from "../lib/stripe";
const graphql = String.raw;


//checkOut resolver fuction....
async function checkOut(
    root: any,
    { token }: { token: string },
    context: KeystoneContext): Promise<OrderCreateInput> {
    //make sure they are sign in 
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error('Sorry! You must be signed in to create order!')
    }

    //query the current user details
    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
        id
        name
        email
        cart{
            id
            quantity
            product{
                name
                price
                description
                id
                photo{
                    id
                    image{
                        id
                        publicUrlTransformed
                    }
                }
            }
        }
        `
    });

    //Filter out cartItem that doesn't have a product refrence
    const cartItems = user.cart.filter((cartItem) => cartItem.product);

    //if signed in is true, calculate total price for their order
    const amount = cartItems.reduce(function (tally: number, cartItem: CartItemCreateInput) {
        return tally + cartItem.quantity * cartItem.product.price;
    }, 0);

    //create the payment with the stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err)
        throw new Error(err.message)
    });

    //Covert the cartItems to OrderItems
    const orderItems = cartItems.map((cartItem) => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            photo: { connect: { id: cartItem.product.photo.id } },
        };
        return orderItem
    });

    //Create the order and return it
    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } }
        }
    });

    // Clean up any old cartItems 
    const cartItemsIds = cartItems.map(cartItem => cartItem.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemsIds
    })

    return order
}


export default checkOut;