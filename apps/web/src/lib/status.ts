export const orderStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'] as const

export const orderStatusLabel: Record<string, string> = {
  PENDING: 'Aguardando pagamento',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
}

export const orderStatusTone: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  PAID: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  SHIPPED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  DELIVERED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
}

export const paymentLabel: Record<string, string> = {
  PIX: 'PIX (simulado)',
  CARD: 'Cartão de crédito (simulado)',
  BOLETO: 'Boleto (simulado)',
}
