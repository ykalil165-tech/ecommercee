import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { getProducts } from '../api/productService';
import { getCategories } from '../api/categoryService';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = useCallback(async (indicator = 'full') => {
    if (indicator === 'full') setLoading(true);
    else setRefreshing(true);
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p.data);
      setCategories(c.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleProductAdded = () => {
    setShowForm(false);
    fetchAll('refresh');
  };

  const handleProductDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
    || p.description?.toLowerCase().includes(search.toLowerCase())
    || p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchAll('refresh')}
            loading={refreshing}
          >
            <RefreshCw size={15} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={15} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16"><Spinner size="lg" /></div>
        ) : (
          <ProductTable
            products={filtered}
            onDeleted={handleProductDeleted}
          />
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add New Product">
        <ProductForm categories={categories} onSuccess={handleProductAdded} />
      </Modal>
    </div>
  );
}
