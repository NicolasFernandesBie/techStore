import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { categories, products } from './data/products'

const prisma = new PrismaClient()

async function main() {
  const categoryIds = new Map<string, string>()

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    })
    categoryIds.set(category.slug, record.id)
  }

  for (const product of products) {
    const { categorySlug, specs, ...rest } = product
    const categoryId = categoryIds.get(categorySlug)
    if (!categoryId) {
      throw new Error(`Categoria inexistente no seed: ${categorySlug}`)
    }
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } })
    if (existing) continue

    await prisma.product.create({
      data: { ...rest, specs: JSON.stringify(specs), categoryId },
    })
  }

  const adminHash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@techstore.com' },
    update: { role: 'ADMIN', name: 'Administrador' },
    create: {
      name: 'Administrador',
      email: 'admin@techstore.com',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })

  const clientHash = await bcrypt.hash('cliente123', 10)
  await prisma.user.upsert({
    where: { email: 'cliente@techstore.com' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'cliente@techstore.com',
      passwordHash: clientHash,
      role: 'CUSTOMER',
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'BEMVINDO10' },
    update: { percent: 10, active: true },
    create: { code: 'BEMVINDO10', percent: 10, active: true },
  })

  console.log(
    `[seed] ${categories.length} categorias, ${products.length} produtos, usuários e cupom garantidos`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
