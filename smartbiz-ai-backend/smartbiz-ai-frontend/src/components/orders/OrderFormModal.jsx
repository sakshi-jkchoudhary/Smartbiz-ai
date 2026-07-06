import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Plus, Minus, Trash2, Search, X } from 'lucide-react';
import Modal from '../common/Modal';
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
    productApi.getAll().then((res) => setProducts(res.data.data || []));
    customerApi.getAll().then((res) => setCustomers(res.data.data || []));
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
      return toast.error('This product is out of stock');
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
      return toast.error('Add at least one product to the order');
    }
    setLoading(true);
    try {
      await orderApi.create({
        customerId: customerId || null,
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        discount: Number(discount) || 0,
        paymentMode: paymentMode,
      });
      toast.success('Order created!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      {/* Main Wrapper: Fully reactive to light/dark toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header Component */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">New order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer and Payment Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Customer (optional)</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Walk-in customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Payment mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="cash">CASH</option>
              <option value="online">ONLINE</option>
            </select>
          </div>
        </div>

        {/* Product Browser */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Add products</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products to add..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Dynamic Grid Selection Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => addToCart(product)}
                className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{product.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatCurrency(product.price)} • {product.stockQty} left</p>
                </div>
                <Plus className="w-4 h-4 text-indigo-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Current Order Selection Basket */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Order items</label>
          {cart.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No items added yet</p>
          ) : (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">{item.name}</span>
                    <span className="text-xs text-slate-400">{formatCurrency(item.price)} per {item.unit || 'pc'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-white dark:bg-slate-900">
                      <button onClick={() => updateQty(item.productId, -1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold px-1 text-slate-800 dark:text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white min-w-[60px] text-right">{formatCurrency(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculation Totals Meta Area */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Discount (₹)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-sm text-right text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div className="flex flex-col justify-center items-end text-right">
            <span className="text-xs text-slate-400 font-medium">Grand Total</span>
            <span className="text-xl font-black text-indigo-600 dark:text-brand-400">{formatCurrency(finalAmount)}</span>
          </div>
        </div>

        {/* CTA Footer Form Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl text-sm font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create order'}
          </button>
        </div>

      </div>
    </div>
  );
}