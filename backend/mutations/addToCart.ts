import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from "../types";


//addToCart resolver fuction....
async function addToCart(
    root: any,
    { productId }: { productId: string },
    context: KeystoneContext): Promise<CartItemCreateInput> {

    //Query the current user, see if they are sign in
    const sesh = context.session as Session;
    if (!sesh.itemId) {
        throw new Error("You must be logged in to do this")
    }
    //Query the current user cart
    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId } },
        //Specifies which field to query and return
        resolveFields: 'id,quantity'
    });

    const [existingCartItem] = allCartItems;

    //Check if current item is in the cart, If it is, increment it by 1
    if (existingCartItem) {
        return await context.lists.CartItem.updateOne({
            id: existingCartItem.id,
            data: { quantity: existingCartItem.quantity + 1 }
        })
    }
    // if it isn't create a new cart item
    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId } },
            user: { connect: { id: sesh.itemId } },
        }
    })
}


export default addToCart;