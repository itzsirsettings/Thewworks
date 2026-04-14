import { useCallback, useEffect, useState } from 'react';
import {
  Edit3,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { formatCurrency } from '../../lib/currency';

interface AdminProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  supplier: string;
  origin: string;
  moq: string;
  lead_time: string;
  rating: number;
  orders: string;
  badge: string;
  summary: string;
}

interface EditingProduct extends Partial<AdminProduct> {
  id?: number;
  imageBase64?: string;
}

const ADMIN_TOKEN_KEY = 'stankings_admin_token';

function getToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Admin session expired. Please sign in again.');
    }

    const body = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export default function AdminProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditingProduct>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<EditingProduct>({
    name: '',
    price: 0,
    category: 'Living Room',
    image: '',
    supplier: 'Turkish Sofa Collective',
    origin: '',
    moq: '',
    lead_time: '',
    rating: 4.5,
    orders: '',
    badge: '',
    summary: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      setError('');
      const data = await apiFetch<AdminProduct[]>('/api/admin/products');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const startEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    setSaving(true);
    setError('');
    try {
      await apiFetch(`/api/admin/products/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      showSuccess('Product updated successfully! Store will update in realtime.');
      cancelEdit();
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This is permanent.`)) return;

    setSaving(true);
    setError('');
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      showSuccess('Product deleted successfully.');
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    } finally {
      setSaving(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.supplier) {
      setError('Name, price, category, and supplier are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });
      showSuccess('Product created successfully!');
      setShowAddForm(false);
      setNewProduct({
        name: '',
        price: 0,
        category: 'Living Room',
        image: '',
        supplier: 'Turkish Sofa Collective',
        origin: '',
        moq: '',
        lead_time: '',
        rating: 4.5,
        orders: '',
        badge: '',
        summary: '',
      });
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'edit' | 'new') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (fieldName === 'new') {
        updateNewField('imageBase64', base64);
      } else {
        updateEditField('imageBase64', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateEditField = (field: keyof EditingProduct, value: string | number) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNewField = (field: keyof EditingProduct, value: string | number) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-sm text-slate-500">Loading products…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a1a2a] shadow-md">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
              Product Manager
            </h2>
            <p className="text-xs text-slate-500">
              {products.length} products · Changes update the store in realtime
            </p>
          </div>
        </div>

        <button
          type="button"
          title="Add a new product"
          onClick={() => {
            setShowAddForm(!showAddForm);
            cancelEdit();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#6d28d9]"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ {successMessage}
        </div>
      )}

      {/* Add new product form */}
      {showAddForm && (
        <div className="mb-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">New Product</h3>
            <button
              type="button"
              title="Close form"
              aria-label="Close form"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <InputField label="Product name" value={newProduct.name ?? ''} onChange={(v) => updateNewField('name', v)} />
            </div>
            <InputField label="Price (₦)" value={String(newProduct.price ?? '')} type="number" onChange={(v) => updateNewField('price', Number(v))} />
            <SelectField label="Category" value={newProduct.category ?? ''} options={['Living Room', 'Bedroom', 'Office', 'Appliances', 'Decor']} onChange={(v) => updateNewField('category', v)} />
            
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Product Image</label>
              <input
                type="file"
                title="Product Image"
                aria-label="Upload product image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'new')}
                className="w-full rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1.5 text-sm text-slate-900 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 file:mr-3 file:rounded-md file:border-0 file:bg-[#7c3aed]/10 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-[#7c3aed]"
              />
              {newProduct.imageBase64 && <span className="mt-1 block text-xs text-emerald-600">✓ Image ready</span>}
            </div>

            <SelectField label="Supplier" value={newProduct.supplier ?? ''} options={['Turkish Sofa Collective', 'Stankings Contract Studio', 'Boardroom Works', 'Delta Appliance Depot', 'Interior Finish House']} onChange={(v) => updateNewField('supplier', v)} />
            <InputField label="Origin" value={newProduct.origin ?? ''} onChange={(v) => updateNewField('origin', v)} />
            <InputField label="MOQ" value={newProduct.moq ?? ''} placeholder="e.g. 2 sets" onChange={(v) => updateNewField('moq', v)} />
            <InputField label="Lead time" value={newProduct.lead_time ?? ''} placeholder="e.g. 7-10 days" onChange={(v) => updateNewField('lead_time', v)} />
            <InputField label="Badge" value={newProduct.badge ?? ''} placeholder="e.g. New arrival" onChange={(v) => updateNewField('badge', v)} />
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Summary</label>
            <textarea
              title="Product Summary"
              aria-label="Product Summary"
              value={newProduct.summary ?? ''}
              onChange={(e) => updateNewField('summary', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={addProduct}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Create product
            </button>
          </div>
        </div>
      )}

      {/* Product table */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Supplier
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Badge
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-[#fafbfc]">
                  {editingId === product.id ? (
                    /* ─── Inline edit row ─── */
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9]">
                            <img
                              src={editForm.imageBase64 || editForm.image || product.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                              <ImagePlus size={16} className="text-white" />
                              <input 
                                type="file" 
                                title="Change product image"
                                aria-label="Change product image"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'edit')} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                          <div className="min-w-0">
                            <input
                              aria-label="Product Name"
                              title="Product Name"
                              value={editForm.name ?? ''}
                              onChange={(e) => updateEditField('name', e.target.value)}
                              className="w-full rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30"
                            />
                            {editForm.imageBase64 && <span className="mt-1 block text-xs text-emerald-600">✓ New image pending save</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          aria-label="Category"
                          title="Category"
                          value={editForm.category ?? ''}
                          onChange={(e) => updateEditField('category', e.target.value)}
                          className="rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-[#7c3aed]"
                        >
                          {['Living Room', 'Bedroom', 'Office', 'Appliances', 'Decor'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          aria-label="Price"
                          title="Price"
                          type="number"
                          value={editForm.price ?? ''}
                          onChange={(e) => updateEditField('price', Number(e.target.value))}
                          className="w-28 rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-[#7c3aed]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          aria-label="Supplier"
                          title="Supplier"
                          value={editForm.supplier ?? ''}
                          onChange={(e) => updateEditField('supplier', e.target.value)}
                          className="w-full rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-[#7c3aed]"
                        >
                          {['Turkish Sofa Collective', 'Stankings Contract Studio', 'Boardroom Works', 'Delta Appliance Depot', 'Interior Finish House'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          aria-label="Badge"
                          title="Badge"
                          value={editForm.badge ?? ''}
                          onChange={(e) => updateEditField('badge', e.target.value)}
                          className="w-full rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-[#7c3aed]"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    /* ─── Display row ─── */
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f1f5f9]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-slate-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {product.supplier}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-[#7c3aed]">
                          {product.badge}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#7c3aed] hover:text-[#7c3aed]"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            aria-label="Delete product"
                            onClick={() => deleteProduct(product.id, product.name)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                    No products found. Click "Add product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Small reusable field components ─── */

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      <input
        aria-label={label}
        title={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
