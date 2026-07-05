import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { Input, Select } from '../common/Input';
import Button from '../common/Button';
import { productApi } from '../../api/productApi';
import {Html5QrcodeScanner} from "html5-qrcode";

const UNITS = ['pcs', 'kg', 'g', 'litre', 'ml', 'bag', 'box', 'pack'];

const EMPTY_FORM = {
  name: '',
  category: '',
  sku: '',
  barcode: '',
  price: '',
  costPrice: '',
  stockQty: '',
  unit: 'pcs',
  reorderThreshold: '5',
};

export default function ProductFormModal({ isOpen, onClose, onSuccess, product }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        price: product.price ?? '',
        costPrice: product.costPrice ?? '',
        stockQty: product.stockQty ?? '',
        unit: product.unit || 'pcs',
        reorderThreshold: product.reorderThreshold ?? '5',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product, isOpen]);
  useEffect(() => {
    if (!showScanner) return;
    console.log("Scanner started");
    }, [showScanner]); 

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Product name is required';
    if (!form.price || Number(form.price) < 0) newErrors.price = 'Enter a valid price';
    if (form.stockQty === '' || Number(form.stockQty) < 0)
      newErrors.stockQty = 'Enter a valid stock quantity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      costPrice: Number(form.costPrice) || 0,
      stockQty: Number(form.stockQty),
      reorderThreshold: Number(form.reorderThreshold) || 5,
    };
    try {
      if (isEdit) {
        await productApi.update(product._id, payload);
        toast.success('Product updated');
      } else {
        await productApi.create(payload);
        toast.success('Product added');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit product' : 'Add product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product name"
          name="name"
          placeholder="Basmati Rice 5kg"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Category"
            name="category"
            placeholder="Grains"
            value={form.category}
            onChange={handleChange}
          />
          <Input
            label="SKU (optional)"
            name="sku"
            placeholder="RIC-5KG"
            value={form.sku}
            onChange={handleChange}
          />
        
        <Input
          label="Barcode "
          name="barcode"
          placeholder="8901234567890"
          value={form.barcode}
          onChange={handleChange}
        />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Selling price (₹)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="450"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
          />
          <Input
            label="Cost price (₹)"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="380"
            value={form.costPrice}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Stock qty"
            name="stockQty"
            type="number"
            min="0"
            placeholder="40"
            value={form.stockQty}
            onChange={handleChange}
            error={errors.stockQty}
            className="col-span-1"
          />
          <Select label="Unit" name="unit" value={form.unit} onChange={handleChange}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
          <Input
            label="Reorder at"
            name="reorderThreshold"
            type="number"
            min="0"
            placeholder="10"
            value={form.reorderThreshold}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end mb-3">
          <button
            type="button"
            variant="secondary"
            onClick={() => setShowScanner(true)}>
             Scan Barcode
          </button>
        </div>
        {showScanner && (
          <div 
          id="barcode-reader"
          className="booder rounded-lg p-3 mt-3"
       > </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
