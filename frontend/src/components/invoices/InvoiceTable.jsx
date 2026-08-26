import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MessageSquare, Calendar, User } from 'lucide-react';

export function InvoiceTable({ invoices = [], onSendReminder = null }) {
  if (!invoices || invoices.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        No invoices found in this view.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Customer Name</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => {
            const isOverdue = inv.status === 'OVERDUE';
            return (
              <tr key={inv.id}>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>
                  #INV-{inv.id}
                </td>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} style={{ color: 'var(--text-muted)' }} />
                    {inv.customerName}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {inv.dueDate || 'No Due Date'}
                  </div>
                </td>
                <td className="mono" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  ₹{Number(inv.amount || 0).toLocaleString('en-IN')}
                </td>
                <td>
                  <Badge variant={inv.status}>{inv.status}</Badge>
                </td>
                <td>
                  {isOverdue && onSendReminder ? (
                    <Button
                      variant="indigo"
                      size="sm"
                      icon={MessageSquare}
                      onClick={() => onSendReminder(inv)}
                    >
                      AI Reminder
                    </Button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
