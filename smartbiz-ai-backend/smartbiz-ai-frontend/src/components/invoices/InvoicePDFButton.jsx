import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function InvoicePDFButton({ invoice, businessName }) {
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(businessName || 'Your Business', 14, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Invoice ${invoice.invoiceNumber}`, 14, 27);
    doc.text(`Date: ${formatDate(invoice.issuedDate)}`, 14, 32);
    doc.text(`Billed to: ${invoice.customerNameSnapshot}`, 14, 37);

    autoTable(doc, {
      startY: 44,
      head: [['Item', 'Qty', 'Price', 'Subtotal']],
      body: invoice.items.map((item) => [
        item.name,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.subtotal),
      ]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Subtotal: ${formatCurrency(invoice.totalAmount)}`, 140, finalY);
    if (invoice.discount > 0) {
      doc.text(`Discount: -${formatCurrency(invoice.discount)}`, 140, finalY + 6);
    }
    doc.setFont(undefined, 'bold');
    doc.text(
      `Total: ${formatCurrency(invoice.finalAmount)}`,
      140,
      finalY + (invoice.discount > 0 ? 13 : 6)
    );

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  return (
    <Button icon={Download} onClick={handleDownload} variant="secondary">
      Download PDF
    </Button>
  );
}
