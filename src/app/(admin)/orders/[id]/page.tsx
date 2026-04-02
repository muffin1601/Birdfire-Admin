'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ChevronLeft, Package, User, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'


export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .eq('id', id)
        .single()

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

      setOrder(orderData)
      setItems(itemsData || [])
      setLoading(false)
    }

    loadData()
  }, [id])

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setOrder({ ...order, status: newStatus })
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading order details...</div>
  if (!order) return <div style={{ padding: '2rem' }}>Order not found</div>

  return (
    <div style={{ maxWidth: '1000px' }}>
      <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', marginBottom: '2rem', textDecoration: 'none' }}>
        <ChevronLeft size={20} />
        Back to Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Order #{order.order_number}</h1>
          <p style={{ color: '#888' }}>Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333' }}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #333' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <Package size={20} />
              Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.image_url} alt={item.product_name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.product_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>Qty {item.quantity} × {formatCurrency(item.price)}</div>

                    </div>
                  </div>
                  <div style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</div>

                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total)}</span>

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '12px', borderTop: '1px solid #333', paddingTop: '12px' }}>
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #333' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1rem' }}>
              <User size={18} />
              Customer
            </h3>
            <div style={{ fontWeight: '500' }}>{order.user?.full_name || 'Guest'}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>{order.user?.email || 'No email'}</div>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #333' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1rem' }}>
              <CreditCard size={18} />
              Payment
            </h3>
            <div>Status: <span style={{ color: order.status === 'paid' ? '#10b981' : '#f59e0b' }}>{order.status.toUpperCase()}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
