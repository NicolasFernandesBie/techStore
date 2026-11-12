import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/http'
import { shippingProvider } from '../shipping/shipping.provider'
import { paymentGateway, type PaymentMethod } from '../payments/payment.gateway'

export type CreateOrderItemInput = { productId: string; quantity: number }

export type CreateOrderInput = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingMethod: string
  paymentMethod: PaymentMethod
  couponCode?: string
  items: CreateOrderItemInput[]
}

function generateCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let output = ''
  for (let index = 0; index < 6; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `TS-${output}`
}

export async function createOrder(input: CreateOrderInput, userId?: string) {
  if (input.items.length === 0) throw new AppError('Carrinho vazio', 400)

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((item) => item.productId) } },
  })
  const productById = new Map(products.map((product) => [product.id, product]))

  const lines = input.items.map((item) => {
    const product = productById.get(item.productId)
    if (!product) throw new AppError('Produto do carrinho não encontrado', 404)
    if (product.stock < item.quantity) {
      throw new AppError(`Estoque insuficiente para ${product.name}`, 409)
    }
    return {
      product,
      quantity: item.quantity,
      totalCents: product.priceCents * item.quantity,
    }
  })

  const subtotalCents = lines.reduce((sum, line) => sum + line.totalCents, 0)

  let discountCents = 0
  let couponCode: string | undefined
  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode.trim().toUpperCase() },
    })
    if (!coupon || !coupon.active) throw new AppError('Cupom inválido', 400)
    discountCents = Math.round((subtotalCents * coupon.percent) / 100)
    couponCode = coupon.code
  }

  const options = shippingProvider.quote({
    zip: input.shippingZip,
    subtotalCents,
  })
  const shipping = options.find((option) => option.id === input.shippingMethod)
  if (!shipping) throw new AppError('Opção de frete inválida', 400)

  const totalCents = subtotalCents - discountCents + shipping.priceCents
  const code = generateCode()

  const payment = await paymentGateway.charge({
    amountCents: totalCents,
    method: input.paymentMethod,
    orderCode: code,
  })

  const status = payment.status === 'APPROVED' ? 'PAID' : 'PENDING'

  const order = await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: { id: line.product.id, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      })
      if (updated.count === 0) {
        throw new AppError(`Estoque insuficiente para ${line.product.name}`, 409)
      }
    }

    return tx.order.create({
      data: {
        code,
        status,
        userId: userId ?? null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingName: input.customerName,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingState: input.shippingState.toUpperCase(),
        shippingZip: input.shippingZip,
        shippingMethod: shipping.label,
        shippingCents: shipping.priceCents,
        subtotalCents,
        discountCents,
        totalCents,
        couponCode,
        paymentMethod: input.paymentMethod,
        paymentStatus: payment.status,
        paymentTxId: payment.txId,
        items: {
          create: lines.map((line) => ({
            productId: line.product.id,
            productName: line.product.name,
            productImage: line.product.imageUrl,
            unitPriceCents: line.product.priceCents,
            quantity: line.quantity,
            totalCents: line.totalCents,
          })),
        },
      },
      include: { items: true },
    })
  })

  return order
}
