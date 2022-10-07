// Elist disable

// simplest permission return a yes or no just like what we do below here 

import { permissionsList } from "./schemas/fields"
import { ListAccessArgs } from "./types"

export function isSignedIn({ session }) {
    return !!session
};

// Checking user to role, to able to give permission on what they can do .
// But here we are using a generated function from our permission list 
// field object.

//Permission based function

const generatedPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
        permission,
        function ({ session }: ListAccessArgs) {
            return !!session?.data.role?.[permission];
        },
    ])
);
export const permissions = {
    ...generatedPermissions
};

// Rules based function 

export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        if (!isSignedIn) {
            return false
        }
        // Check if they have the permission of canManageProduct
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        //If not, Do they create the products
        return { user: { id: session.itemId } }
    },
    canOrder({ session }: ListAccessArgs) {
        if (!isSignedIn) {
            return false
        }
        // Check if they have the permission of canManageCart
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { user: { id: session.itemId } }
    },
    canManageOrderItems({ session }: ListAccessArgs) {
        if (!isSignedIn) {
            return false
        }
        // Check if they have the permission of order
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { order: { user: { id: session.itemId } } }
    },
    canReadProducts({ session }: ListAccessArgs) {
        if (!isSignedIn) {
            return false
        }
        // If true user have access to manage product
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // They should only see available products(based on status fields)
        return { status: 'AVAILABLE' }
    },
    canManageUsers({ session }: ListAccessArgs) {
        if (!isSignedIn) {
            return false
        }
        // Check if they have the permission of canManageUser
        if (permissions.canManageUsers({ session })) {
            return true;
        }

        //Othewise they can only updtate themself
        return { id: session.itemId }
    },
}