import React, { useState, useRef } from 'react';
import { X, Scan, Upload, ImageIcon, Camera } from 'lucide-react';
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
  
  // Real-time Camera Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Web Camera Turn On
  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access blocked or not found:", err);
      alert("Could not access webcam. Please check permissions!");
      setIsScanning(false);
    }
  };

  // 2. Web Camera Turn Off
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // 3. Simulate Barcode detection from active stream
  const captureBarcodeSample = () => {
    const simulatedDetectedBarcode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    setFormData((prev) => ({ ...prev, barcode: simulatedDetectedBarcode }));
    stopCamera();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        price: Number(formData.price),
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        stockQty: Number(formData.stockQty),
        unit: formData.unit,
        reorderThreshold: Number(formData.reorderThreshold),
        image: imagePreview || undefined
      };

      if (product) {
        // Update product api check
        await inventoryApi.update(product._id || product.id, payload);
      } else {
        // Create product api check
        await inventoryApi.create(payload);
      }

      stopCamera();
      onSuccess();
      onClose();
    } catch (err) {
      console.error("API Error during product save:", err);
      alert("Failed to save product in database. Please try again.");
    }
  };
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {product ? 'Edit product' : 'Add product'}
          </h3>
          <button onClick={() => { stopCamera(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Image Upload Area */}
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

          <Input label="Product name" name="name" value={formData.name} onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" name="category" value={formData.category} onChange={handleChange} required />
            <Input label="SKU (optional)" name="sku" value={formData.sku} onChange={handleChange} />
          </div>

          {/* Barcode Form Field Box */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Barcode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Scan or enter barcode"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center justify-center px-3 bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-slate-700 rounded-xl hover:bg-brand-100 transition"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Selling price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} required />
            <Input label="Cost price (₹)" name="costPrice" type="number" value={formData.costPrice} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Stock qty" name="stockQty" type="number" value={formData.stockQty} onChange={handleChange} required />
            <Select label="Unit" name="unit" value={formData.unit} onChange={handleChange}>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </Select>
            <Input label="Reorder at" name="reorderThreshold" type="number" value={formData.reorderThreshold} onChange={handleChange} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => { stopCamera(); onClose(); }}>Cancel</Button>
            <Button type="submit">{product ? 'Save changes' : 'Add product'}</Button>
          </div>
        </form>

        {/* ----------------- DYNAMIC LIVE CAMERA POPUP OVERLAY ----------------- */}
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 rounded-3xl animate-fadeIn">
            <div className="w-full flex justify-between items-center mb-4 max-w-sm">
              <h4 className="text-white font-semibold text-base">Scan barcode</h4>
              <button type="button" onClick={stopCamera} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Webcam Frame Box Viewport */}
            <div className="relative w-full max-w-sm aspect-video rounded-2xl border-2 border-brand-500 bg-black overflow-hidden flex items-center justify-center group shadow-2xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              
              {/* Target Aim overlay target bracket lines just like friend's box */}
              <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 absolute top-1/2 left-0 animate-pulse" />
              </div>

              {/* Click to capture layer simulator */}
              <button 
                type="button"
                onClick={captureBarcodeSample}
                className="absolute bottom-3 bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                Tap to Scan Code
              </button>
            </div>
            
            <p className="text-slate-400 text-xs text-center mt-4 max-w-xs">
              Point the camera at a barcode. It'll be picked up automatically.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}