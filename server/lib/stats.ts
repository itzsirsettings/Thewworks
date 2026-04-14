import { supabaseAdmin } from './supabase-admin.js';

export interface DashboardStats {
  metrics: {
    gmv: number;
    totalOrders: number;
    conversionRate: number;
    avgOrderSize: number;
  };
  revenueSeries: Array<{ label: string; revenue: number; orders: number }>;
  categoryDemand: Array<{ category: string; demand: number; conversion: number }>;
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  // 1. Fetch all orders to calculate GMV and conversion
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from('orders')
    .select('status, amount, created_at, reference');

  if (ordersError) throw ordersError;

  // 2. Fetch all order items and products for category analysis
  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('*');

  if (itemsError) throw itemsError;

  const { data: products, error: productsError } = await supabaseAdmin
    .from('products')
    .select('id, category');

  if (productsError) throw productsError;

  // 3. Process Metrics
  const paidOrders = orders.filter(o => o.status === 'paid');
  const gmv = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = orders.length;
  const conversionRate = totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0;
  const avgOrderSize = paidOrders.length > 0 ? gmv / paidOrders.length : 0;

  // 4. Process Revenue Series (Last 4 weeks simple mock-live hybrid)
  // For a real app, we would group by date. For now, we'll return a basic breakdown.
  const revenueSeries = [
    { label: 'Week 1', revenue: gmv * 0.15, orders: Math.floor(paidOrders.length * 0.15) },
    { label: 'Week 2', revenue: gmv * 0.25, orders: Math.floor(paidOrders.length * 0.25) },
    { label: 'Week 3', revenue: gmv * 0.30, orders: Math.floor(paidOrders.length * 0.30) },
    { label: 'Week 4', revenue: gmv * 0.30, orders: Math.ceil(paidOrders.length * 0.30) },
  ];

  // 5. Process Category Demand
  const categoryCount: Record<string, { demand: number; paid: number }> = {};
  
  items.forEach((item: { quantity: number; order_reference: string; item_id: number }) => {
    const product = products.find(p => Number(p.id) === Number(item.item_id));
    const cat = product?.category || 'Uncategorized';
    if (!categoryCount[cat]) categoryCount[cat] = { demand: 0, paid: 0 };
    categoryCount[cat].demand += item.quantity;
    
    const parentOrder = orders.find(o => o.reference === item.order_reference);
    if (parentOrder?.status === 'paid') {
      categoryCount[cat].paid += item.quantity;
    }
  });

  const categoryDemand = Object.entries(categoryCount).map(([category, stats]) => ({
    category,
    demand: stats.demand,
    conversion: stats.demand > 0 ? (stats.paid / stats.demand) * 100 : 0
  }));

  return {
    metrics: {
      gmv,
      totalOrders,
      conversionRate,
      avgOrderSize,
    },
    revenueSeries,
    categoryDemand: categoryDemand.sort((a, b) => b.demand - a.demand)
  };
}
