const Product = require('../models/Product')

const FREE_DELIVERY_MIN = 999
const DELIVERY_FEE = 49

function deliveryFeeForSubtotal(subtotal) {
    if (subtotal >= FREE_DELIVERY_MIN || subtotal === 0) {
        return 0
    }
    return DELIVERY_FEE
}

/**
 * Validates cart lines against DB prices/stock and returns order totals.
 * @param {{ product: string, quantity: number }[]} items
 */
async function resolveCartPricing(items) {
    if (!Array.isArray(items) || items.length < 1) {
        throw new Error('Cart is empty')
    }

    const productIds = items.map((line) => line.product)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== new Set(productIds).size) {
        throw new Error('One or more products are unavailable')
    }

    const byId = new Map(products.map((p) => [String(p._id), p]))
    let subtotal = 0
    const orderProducts = []

    for (const line of items) {
        const product = byId.get(String(line.product))
        if (!product) {
            throw new Error('One or more products are unavailable')
        }
        const quantity = Number(line.quantity)
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error('Invalid quantity')
        }
        if (product.stockQty < quantity) {
            throw new Error(`Insufficient stock for ${product.title}`)
        }
        subtotal += product.sellingPrice * quantity
        orderProducts.push({ product: product._id, quantity })
    }

    const deliveryFee = deliveryFeeForSubtotal(subtotal)
    const totalAmount = subtotal + deliveryFee

    return { products: orderProducts, subtotal, deliveryFee, totalAmount }
}

module.exports = {
    FREE_DELIVERY_MIN,
    DELIVERY_FEE,
    deliveryFeeForSubtotal,
    resolveCartPricing,
}
