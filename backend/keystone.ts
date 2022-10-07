import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
require('dotenv').config()
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';
const databaseURL = process.env.DATABASE_URL;

//session config
const sessionConfiq = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
};

//creating auth for the keystone and others
const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password']
        //Todo: add roles to it
    },
    passwordResetLink: {
        async sendToken(args) {
            await sendPasswordResetEmail(args.token, args.identity);
        }
    }
})

//Config for keystone to connect with data base and also the frontend
export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(Keystone) {
            console.log('database connected')
            if (process.argv.includes('--seed-data')) {
                await insertSeedData(Keystone);
            }
        }

    },
    lists: createSchema({
        // Schema items go in here
        User,
        Product,
        ProductImage,
        CartItem,
        OrderItem,
        Order,
        Role,

    }),
    extendGraphqlSchema,
    ui: {
        isAccessAllowed: ({ session }) => {

            return !!session?.data
        }
    },
    session: withItemData(statelessSessions(sessionConfiq), {
        // GraphQL query
        User: `id name email role { ${permissionsList.join(' ')}}`
    })
}))
