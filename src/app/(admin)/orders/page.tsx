'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Eye, Search, Filter } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data || [])
      }
      setLoading(false)
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'failed': return '#ef4444'
      case 'shipped': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Order Management</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input 
            type="text"
            placeholder="Search order # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 40px', 
              borderRadius: '8px', 
              border: '1px solid #333',
              backgroundColor: '#1a1a1a',
              color: 'white'
             }}
          />
        </div>
        <button style={{ padding: '0 1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white' }}>
          <Filter size={18} />
        </button>
      </div>

      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '1rem' }}>Order Number</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No orders found</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.order_number}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{order.user?.full_name || 'Guest'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.user?.email || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{formatCurrency(order.total)}</td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      backgroundColor: `${getStatusColor(order.status)}22`,
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}44`
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/orders/${order.id}`}>
                      <button style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#333', color: 'white' }}>
                        <Eye size={16} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
