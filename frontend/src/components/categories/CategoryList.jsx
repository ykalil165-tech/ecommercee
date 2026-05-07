import { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { createCategory } from '../../api/categoryService';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import toast from 'react-hot-toast';

export default function CategoryList({ categories, onAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required'); return; }
    setLoading(true);
    try {
      const res = await createCategory({ name: name.trim() });
      toast.success('Category added');
      setName('');
      setError('');
      onAdded?.(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="New category name..."
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            error={error}
          />
        </div>
        <Button type="submit" loading={loading} className="shrink-0">
          <Plus size={16} />
          Add
        </Button>
      </form>

      <div className="mt-4">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-slate-400 dark:text-slate-600">
            <Tag size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No categories yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <Tag size={14} className="text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.name}</span>
                <Badge color="slate">#{c.id}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
