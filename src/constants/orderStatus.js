export const ORDER_STATUS = {
  placed: { label: 'Order Placed', color: '#fbbf24', icon: '📋' },
  confirmed: { label: 'Confirmed', color: '#38bdf8', icon: '✅' },
  dispatched: { label: 'Dispatched', color: '#a78bfa', icon: '🚚' },
  received: { label: 'Received', color: '#34d399', icon: '📦' },
  completed: { label: 'Completed', color: '#2dd4bf', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#f87171', icon: '✕' },
}

export const STATUS_STEPS = ['placed', 'confirmed', 'dispatched', 'received', 'completed']

export function getStatusIndex(status) {
  if (status === 'cancelled') return -1
  return STATUS_STEPS.indexOf(status)
}

export function isActiveStep(stepStatus, currentStatus) {
  const stepIdx = STATUS_STEPS.indexOf(stepStatus)
  const currentIdx = getStatusIndex(currentStatus)
  return stepIdx <= currentIdx
}
