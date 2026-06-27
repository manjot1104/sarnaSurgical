export const ORDER_STATUS = {
  placed: { label: 'Order Placed', color: '#d97706', icon: '📋' },
  confirmed: { label: 'Confirmed', color: '#0284c7', icon: '✅' },
  dispatched: { label: 'Dispatched', color: '#7c3aed', icon: '🚚' },
  received: { label: 'Received', color: '#059669', icon: '📦' },
  completed: { label: 'Completed', color: '#0d9488', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#dc2626', icon: '✕' },
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
