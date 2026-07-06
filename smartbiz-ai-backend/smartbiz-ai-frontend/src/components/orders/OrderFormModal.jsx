import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Plus, Minus, Trash2, Search } from 'lucide-react';
import Modal from '../common/Modal';
import { Input, Select } from '../common/Input';
import Button from '../common/Button';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';
import { customerApi } from '../../api/customerApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { PAYMENT_MODES } from '../../utils/constants';

export default function OrderFormModal({ isOpen, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [discount, setDiscount] = useState('0');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    productApi.getAll().then((res) => setProducts(res.data.data || [])).catch(() => {});
    customerApi.getAll().then((res) => setCustomers(res.data.data || [])).catch(() => {});
    setCart([]);
    setCustomerId('');
    setDiscount('0');
    setPaymentMode('cash');
    setProductSearch('');
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 6);
    return products
      .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
      .slice(0, 6);
  }, [products, productSearch]);

  const addToCart = (product) => {
    if (product.stockQty <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stockQty) {
          toast.error('Not enough stock available');
          return prev;
        }
        return prev.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          stockQty: product.stockQty,
          unit: product.unit,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty > item.stockQty) {
            toast.error('Not enough stock available');
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalAmount = Math.max(totalAmount - (Number(discount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Add at least one product to the order');
      return;
    }
    setLoading(true);
    try {
      await orderApi.create({
        customerId: customerId || null,
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        discount: paymentMode === 'pending' ? 0.99 : (Number(discount) || 0),
        paymentMode: 'cash', 
      });
      toast.success('Order created');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New order" size="xl">
      {/* Dynamic forms context matching exactly with products dashboard view layout definitions */}
      <form onSubmit={handleSubmit} className="space-y-5 text-slate-900 dark:text-white bg-transparent">
        
        {/* Dropdowns Configuration */}
        <div className="grid grid-cols-2 gap-3 text-slate-900 dark:text-white">
          <Select label="Customer (optional)" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Walk-in customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select label="Payment mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            {PAYMENT_MODES.map((m) => (
              <option key={m} value={m}>
                {m.toUpperCase()}
              </option>
            ))}
            <option value="pending">Credit / PENDING</option>
          </Select>
        </div>

        {/* Product Selection List Input fields mapping */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Add products</label>
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products to add..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="input-field pl-9 w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                type="button"
                key={p._id}
                onClick={() => addToCart(p)}
                disabled={p.stockQty <= 0}
                className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-brand-300 dark:hover:border-slate-700 hover:bg-brand-50/50 dark:hover:bg-slate-800 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{p.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatCurrency(p.price)} · {p.stockQty} {p.unit} left
                  </p>
                </div>
                <Plus className="w-4 h-4 text-brand-500 flex-shrink-0 ml-2" />
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 col-span-2 py-3 text-center">No products found</p>
            )}
          </div>
        </div>

        {/* Selected Orders Grid List view mapping */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order items</label>
          {cart.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No items added yet
            </p>
          ) : (
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-50 dark:divide-slate-800/80 max-h-40 overflow-y-auto bg-white dark:bg-slate-950/30">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, -1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-slate-800 dark:text-slate-200">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, 1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-16 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Aggregation Box context */}
        <div className="flex items-end gap-4">
          <Input
            label="Discount (₹)"
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-40 text-slate-900 dark:text-white"
          />
          <div className="flex-1 bg-surface-soft dark:bg-slate-950/60 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-100 dark:border-slate-800/80">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</span>
            <div className="text-right">
              {Number(discount) > 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 line-through">{formatCurrency(totalAmount)}</p>
              )}
              <p className="text-lg font-black text-indigo-600 dark:text-brand-400">{formatCurrency(finalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions Component Trigger bars */}
        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create order
          </Button>
        </div>
      </form>
    </Modal>
  );
}