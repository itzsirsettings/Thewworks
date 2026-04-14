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
const adminCardClassName =
  'rounded-[28px] border border-[color:var(--admin-stroke)] bg-[rgba(255,251,245,0.88)] shadow-[0_24px_48px_rgba(90,26,42,0.10)] backdrop-blur-xl';
const adminFieldClassName =
  'w-full rounded-xl border border-[color:var(--admin-stroke)] bg-white/80 px-3 py-2 text-sm text-[var(--admin-ink)] outline-none transition placeholder:text-[var(--admin-muted)] focus:border-[color:var(--admin-orange)] focus:ring-2 focus:ring-[rgba(249,115,22,0.14)]';
const adminGhostButtonClassName =
  'inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--admin-stroke)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--admin-muted)] transition hover:border-[color:var(--admin-orange)] hover:text-[var(--admin-burgundy)]';

function getToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
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

export default function StankingsAdminProductManager() {
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

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
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
      showSuccess('Product updated successfully. Store will update in realtime.');
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
      showSuccess('Product created successfully.');
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'edit' | 'new',
  ) => {
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
        <Loader2 size={24} className="animate-spin text-[var(--admin-orange)]" />
        <span className="ml-3 text-sm text-[var(--admin-muted)]">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[1rem] shadow-[0_16px_28px_rgba(90,26,42,0.16)]"
            style={{
              backgroundColor: 'var(--admin-burgundy)',
            }}
          >
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-[-0.03em] text-[var(--admin-ink)]">
              Product Manager
            </h2>
            <p className="text-xs text-[var(--admin-muted)]">
              {products.length} products | Changes update the store in realtime
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
          className="inline-flex items-center gap-2 rounded-[1rem] bg-[var(--admin-burgundy)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(90,26,42,0.16)] transition hover:bg-[var(--admin-burgundy-deep)]"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] px-4 py-3 text-sm font-medium text-[var(--admin-burgundy)]">
          Saved: {successMessage}
        </div>
      )}

      {showAddForm && (
        <div className={`${adminCardClassName} mb-6 p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--admin-ink)]">New Product</h3>
            <button
              type="button"
              title="Close form"
              aria-label="Close form"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg p-1.5 text-[var(--admin-muted)] transition hover:bg-[rgba(90,26,42,0.08)] hover:text-[var(--admin-burgundy)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Product name"
              value={newProduct.name ?? ''}
              onChange={(value) => updateNewField('name', value)}
            />
            <InputField
              label="Price (NGN)"
              value={String(newProduct.price ?? '')}
              type="number"
              onChange={(value) => updateNewField('price', Number(value))}
            />
            <SelectField
              label="Category"
              value={newProduct.category ?? ''}
              options={['Living Room', 'Bedroom', 'Office', 'Appliances', 'Decor']}
              onChange={(value) => updateNewField('category', value)}
            />

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--admin-muted)]">
                Product Image
              </label>
              <input
                type="file"
                title="Product Image"
                aria-label="Upload product image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'new')}
                className={`${adminFieldClassName} py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(90,26,42,0.08)] file:px-2 file:py-1 file:text-xs file:font-semibold file:text-[var(--admin-burgundy)]`}
              />
              {newProduct.imageBase64 && (
                <span className="mt-1 block text-xs text-[var(--admin-burgundy)]">
                  Image ready
                </span>
              )}
            </div>

            <SelectField
              label="Supplier"
              value={newProduct.supplier ?? ''}
              options={[
                'Turkish Sofa Collective',
                'Stankings Contract Studio',
                'Boardroom Works',
                'Delta Appliance Depot',
                'Interior Finish House',
              ]}
              onChange={(value) => updateNewField('supplier', value)}
            />
            <InputField
              label="Origin"
              value={newProduct.origin ?? ''}
              onChange={(value) => updateNewField('origin', value)}
            />
            <InputField
              label="MOQ"
              value={newProduct.moq ?? ''}
              placeholder="e.g. 2 sets"
              onChange={(value) => updateNewField('moq', value)}
            />
            <InputField
              label="Lead time"
              value={newProduct.lead_time ?? ''}
              placeholder="e.g. 7-10 days"
              onChange={(value) => updateNewField('lead_time', value)}
            />
            <InputField
              label="Badge"
              value={newProduct.badge ?? ''}
              placeholder="e.g. New arrival"
              onChange={(value) => updateNewField('badge', value)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-[var(--admin-muted)]">
              Summary
            </label>
            <textarea
              title="Product Summary"
              aria-label="Product Summary"
              value={newProduct.summary ?? ''}
              onChange={(e) => updateNewField('summary', e.target.value)}
              rows={2}
              className={adminFieldClassName}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={addProduct}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[var(--admin-orange)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(249,115,22,0.18)] transition hover:bg-[var(--admin-orange-deep)] disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Create product
            </button>
          </div>
        </div>
      )}

      <div className={`${adminCardClassName} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--admin-stroke)] bg-[rgba(244,230,214,0.8)]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Supplier
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Badge
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(221,198,171,0.6)]">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-[rgba(249,115,22,0.04)]">
                  {editingId === product.id ? (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[rgba(244,230,214,0.8)]">
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
                              className={`${adminFieldClassName} px-2 py-1 font-semibold`}
                            />
                            {editForm.imageBase64 && (
                              <span className="mt-1 block text-xs text-[var(--admin-burgundy)]">
                                New image pending save
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          aria-label="Category"
                          title="Category"
                          value={editForm.category ?? ''}
                          onChange={(e) => updateEditField('category', e.target.value)}
                          className={`${adminFieldClassName} rounded-md px-2 py-1`}
                        >
                          {['Living Room', 'Bedroom', 'Office', 'Appliances', 'Decor'].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
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
                          className={`${adminFieldClassName} w-28 rounded-md px-2 py-1 font-semibold`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          aria-label="Supplier"
                          title="Supplier"
                          value={editForm.supplier ?? ''}
                          onChange={(e) => updateEditField('supplier', e.target.value)}
                          className={`${adminFieldClassName} rounded-md px-2 py-1`}
                        >
                          {[
                            'Turkish Sofa Collective',
                            'Stankings Contract Studio',
                            'Boardroom Works',
                            'Delta Appliance Depot',
                            'Interior Finish House',
                          ].map((supplier) => (
                            <option key={supplier} value={supplier}>
                              {supplier}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          aria-label="Badge"
                          title="Badge"
                          value={editForm.badge ?? ''}
                          onChange={(e) => updateEditField('badge', e.target.value)}
                          className={`${adminFieldClassName} rounded-md px-2 py-1`}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--admin-burgundy)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--admin-burgundy-deep)] disabled:opacity-50"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save
                          </button>
                          <button type="button" onClick={cancelEdit} className={adminGhostButtonClassName}>
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[rgba(244,230,214,0.8)]">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--admin-ink)]">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-[var(--admin-muted)]">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-[rgba(244,230,214,0.9)] px-2.5 py-1 text-xs font-medium text-[var(--admin-burgundy)]">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-[var(--admin-ink)]">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--admin-muted)]">
                        {product.supplier}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-[rgba(90,26,42,0.08)] px-2.5 py-1 text-xs font-medium text-[var(--admin-burgundy)]">
                          {product.badge}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className={adminGhostButtonClassName}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            aria-label="Delete product"
                            onClick={() => deleteProduct(product.id, product.name)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--admin-stroke)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--admin-muted)] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
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
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--admin-muted)]">
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
      <label className="mb-1 block text-xs font-semibold text-[var(--admin-muted)]">{label}</label>
      <input
        aria-label={label}
        title={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={adminFieldClassName}
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
      <label className="mb-1 block text-xs font-semibold text-[var(--admin-muted)]">{label}</label>
      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={adminFieldClassName}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
