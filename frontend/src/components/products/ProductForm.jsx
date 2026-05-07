import { useState } from 'react';
import { createProduct } from '../../api/productService';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const empty = { name: '', description: '', price: '', stock: '', categoryId: '' };

export default function ProductForm({ categories, onSuccess }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Enter a valid stock quantity';
    if (!form.categoryId) e.categoryId = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: { id: Number(form.categoryId) },
      });
      toast.success('Product added successfully');
      setForm(empty);
      setErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        placeholder="e.g. Wireless Headphones"
        value={form.name}
        onChange={set('name')}
        error={errors.name}
      />
      <Input
        label="Description"
        placeholder="Brief product description"
        value={form.description}
        onChange={set('description')}
        error={errors.description}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.price}
          onChange={set('price')}
          error={errors.price}
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          placeholder="0"
          value={form.stock}
          onChange={set('stock')}
          error={errors.stock}
        />
      </div>
      <Select
        label="Category"
        placeholder="Select a category..."
        options={categoryOptions}
        value={form.categoryId}
        onChange={set('categoryId')}
        error={errors.categoryId}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => { setForm(empty); setErrors({}); }}>
          Reset
        </Button>
        <Button type="submit" loading={loading}>
          Add Product
        </Button>
      </div>
    </form>
  );
}
