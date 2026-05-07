import { useState } from 'react';
import { Trash2, Package, ChevronUp, ChevronDown } from 'lucide-react';
import { deleteProduct } from '../../api/productService';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';

function StockBadge({ stock }) {
  if (stock === 0) return <Badge color="red">Out of stock</Badge>;
  if (stock < 10) return <Badge color="amber">Low: {stock}</Badge>;
  return <Badge color="green">{stock} in stock</Badge>;
}

export default function ProductTable({ products, onDeleted }) {
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' });

  const sorted = [...products].sort((a, b) => {
    const av = a[sort.key] ?? '';
    const bv = b[sort.key] ?? '';
    if (typeof av === 'number') return sort.dir === 'asc' ? av - bv : bv - av;
    return sort.dir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      onDeleted?.(deleteId);
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const SortIcon = ({ col }) => {
    if (sort.key !== col) return <ChevronUp size={14} className="opacity-30" />;
    return sort.dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const Th = ({ col, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
      onClick={() => toggleSort(col)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon col={col} />
      </div>
    </th>
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
        <Package size={48} className="mb-3 opacity-40" />
        <p className="text-sm font-medium">No products yet</p>
        <p className="text-xs mt-1">Add your first product using the button above</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <Th col="id">ID</Th>
              <Th col="name">Name</Th>
              <Th col="description">Description</Th>
              <Th col="price">Price</Th>
              <Th col="stock">Stock</Th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map((p) => (
              <tr
                key={p.id}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-4 py-3 text-slate-400 dark:text-slate-500 font-mono text-xs">#{p.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{p.description || '—'}</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                  ${Number(p.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  {p.category ? (
                    <Badge color="blue">{p.category.name}</Badge>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
}
