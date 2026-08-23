export function productFromRow(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price,
    mrp: r.mrp,
    images: r.images?.length ? r.images : [],
    description: r.description || "",
    sku: r.sku || "",
    stock: r.stock,
    featured: r.featured,
    newArrival: r.new_arrival,
    buy1get2: r.buy1get2,
    rating: r.rating || 4.7,
    reviews: r.reviews || 0,
  };
}

export function couponFromRow(r) {
  return {
    code: r.code,
    type: r.type,
    value: r.value,
    minOrder: r.min_order,
    active: r.active,
    description: r.description || "",
  };
}

export function settingsFromRow(r) {
  return {
    storeName: r.store_name,
    supportEmail: r.support_email,
    supportPhone: r.support_phone,
    address: r.address,
    codEnabled: r.cod_enabled,
    codExtraFee: r.cod_extra_fee,
    onlinePaymentEnabled: r.online_payment_enabled,
    paymentProvider: r.payment_provider,
    razorpayKeyId: r.razorpay_key_id || "",
    stripePublishableKey: r.stripe_publishable_key || "",
    freeShippingThreshold: r.free_shipping_threshold,
    shippingFee: r.shipping_fee,
  };
}

export function orderFromRow(r) {
  return {
    id: r.id,
    userId: r.user_id,
    items: r.items,
    shipping: r.shipping,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    subtotal: r.subtotal,
    discount: r.discount,
    shippingFee: r.shipping_fee,
    codFee: r.cod_fee,
    total: r.total,
    coupon: r.coupon,
    status: r.status,
    createdAt: r.created_at,
  };
}

export function orderToRow(o) {
  return {
    id: o.id,
    user_id: o.userId || null,
    items: o.items,
    shipping: o.shipping,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    subtotal: o.subtotal,
    discount: o.discount,
    shipping_fee: o.shippingFee,
    cod_fee: o.codFee,
    total: o.total,
    coupon: o.coupon,
    status: o.status,
    created_at: o.createdAt,
  };
}
