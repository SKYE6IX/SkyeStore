import Stripe from 'stripe';
require('dotenv').config()


const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
    apiVersion: '2020-08-27',
})

export default stripeConfig;