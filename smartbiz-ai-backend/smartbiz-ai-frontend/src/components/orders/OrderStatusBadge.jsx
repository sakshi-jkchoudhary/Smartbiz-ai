import Badge from '../common/Badge';

const STATUS_COLOR = { pending: 'amber', completed: 'green', cancelled: 'red' };

export default function OrderStatusBadge({ status }) {
  return <Badge color={STATUS_COLOR[status] || 'gray'}>{status}</Badge>;
}
