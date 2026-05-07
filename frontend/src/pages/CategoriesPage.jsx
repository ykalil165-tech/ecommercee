import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { getCategories } from '../api/categoryService';
import { getProducts } from '../api/productService';
import CategoryList from '../components/categories/CategoryList';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (indicator = 'full') => {
    if (indicator === 'full') setLoading(true); else setRefreshing(true);
    try {
      const [c, p] = await Promise.all([getCategories(), getProducts()]);
      setCategories(c.data);
      setProducts(p.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCategoryAdded = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const getProductCount = (catId) => products.filter((p) => p.category?.id === catId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => fetchAll('refresh')} loading={refreshing}>
          <RefreshCw size={15} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Add Category</h2>
          {loading ? (
            <Spinner />
          ) : (
            <CategoryList categories={[]} onAdded={handleCategoryAdded} />
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">All Categories</h2>
          </div>
          {loading ? (
            <div className="py-12"><Spinner size="lg" /></div>
          ) : categories.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-10">No categories yet</p>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {categories.map((c) => {
                const count = getProductCount(c.id);
                return (
                  <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 text-sm font-bold">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{c.name}</p>
                        <p className="text-xs text-slate-400">ID: {c.id}</p>
                      </div>
                    </div>
                    <Badge color={count > 0 ? 'blue' : 'slate'}>
                      {count} product{count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
