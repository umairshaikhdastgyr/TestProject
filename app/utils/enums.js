export const USER_TYPES = Object.freeze({
  BUYER: 'BUYER',
  SELLER: 'SELLER',
});

export const ORDER_STATUS = Object.freeze({
  CREATED: 'created',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  CANCELLATION_REQUESTED: 'cancellation_requested',
  CANCELLED: 'cancelled',
  CANCELLATION_DENIED: 'cancellation_denied',
  SHIPPED: 'shipped',
  PARTIAL_SHIPPED: 'partial_shipped',
  DELIVERED: 'delivered',
  RETURN_REQUESTED: 'return_requested',
  RETURN_CANCELLED: 'return_cancelled',

  RETURN_ACCEPTED: 'return_accepted',
  RETURN_SHIPPED: 'return_shipped',
  RETURN_RETURNED: 'return_returned',
  RETURN_COMPLETED: 'return_completed',
  RETURN_DENIED: 'return_declined',
  RETURN_CLOSED: 'return_closed',
  CLAIM_FILED: 'claim_filed',
  CLAIM_ACCEPTED: 'claim_accepted',
  CLAIM_DENIED: 'claim_denied',
  CLAIM_DISPUTED: 'claim_disputed',
  CLAIM_CLOSED: 'claim_closed',
  AWAITING_SHIPPING: 'awaiting_shipping',
  IN_TRANSIT: 'inTransit',
  INACTIVE: 'inactive',
});

export const DELIVERY_TYPES = Object.freeze({
  PICKUP: 'pickup',
  HOMITAG_SHIPPING: 'homitagshipping',
  SHIP_INDEPENDENTLY: 'shipindependently',
});
