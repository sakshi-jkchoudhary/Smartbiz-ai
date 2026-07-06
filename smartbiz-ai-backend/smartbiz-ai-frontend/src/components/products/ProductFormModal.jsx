import React, { useState } from 'react';
import { X, Scan, Upload, ImageIcon } from 'lucide-react';
import Button from '../common/Button';
import { Input, Select } from '../common/Input';

export default function ProductFormModal({ isOpen, onClose, onSuccess, product }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    price: product?.price || '',
    costPrice: product?.costPrice || '',
    stockQty: product?.stockQty || '',
    unit: product?.unit || 'pcs',
    reorderThreshold: product?.reorderThreshold || '5',
  });
  
  const [imagePreview, setImagePreview] = useState(product?.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Barcode Scanner Scam/Simulation Feature
  const handleBarcodeScanSimulate = () => {
    const randomBarcode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    setFormData((prev) => ({ ...prev, [barcode]: randomBarcode }));
  };

  // Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan aapka modal success form api submit logic chalega
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      {/* Main Container - Fully Dark Mode Compatible */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-200">
        
        {/* Header Block */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {product ? 'Edit product' : 'Add product'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* PRODUCT IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <Upload className="w-4 h-4" />
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Product Name */}
          <Input
            label="Product name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Basmati Rice 5kg"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Grains"
              required
            />
            <Input
              label="SKU (optional)"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. RIC-5KG"
            />
          </div>

          {/* BARCODE WITH QUICK SCAN SIMULATION */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Barcode
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan or enter barcode"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <button
                type="button"
                onClick={handleBarcodeScanSimulate}
                className="flex items-center justify-center px-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-slate-700 rounded-xl hover:bg-brand-100 transition"
                title="Simulate Barcode Scan"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Selling price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            <Input
              label="Cost price (₹)"
              name="costPrice"
              type="number"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Stock qty"
              name="stockQty"
              type="number"
              value={formData.stockQty}
              onChange={handleChange}
              placeholder="0"
              required
            />
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
              <option value="pack">pack</option>
            </Select>
            <Input
              label="Reorder at"
              name="reorderThreshold"
              type="number"
              value={formData.reorderThreshold}
              onChange={handleChange}
              placeholder="5"
            />
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Save changes' : 'Add product'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}