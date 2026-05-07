import { useEffect, useState } from 'react';
import { Package, Tag, TrendingUp, DollarSign, TriangleAlert as AlertTriangle } from 'lucide-react';
import { getProducts } from '../api/productService';
import { getCategories } from '../api/categoryService';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  };
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={products.length} sub="All listed products" color="blue" />
        <StatCard icon={Tag} label="Categories" value={categories.length} sub="Product categories" color="green" />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="price × stock"
          color="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStock}
          sub={outOfStock > 0 ? `${outOfStock} out of stock` : 'All stocked'}
          color={lowStock > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Products</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentProducts.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">No products added yet</p>
            ) : recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category?.name ?? 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">${Number(p.price).toFixed(2)}</span>
                  {p.stock === 0
                    ? <Badge color="red">Out</Badge>
                    : p.stock < 10
                      ? <Badge color="amber">Low</Badge>
                      : <Badge color="green">{p.stock}</Badge>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Categories</h2>
          </div>
          <div className="p-6 space-y-3">
            {categories.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-4">No categories yet</p>
            ) : categories.map((c) => {
              const count = products.filter((p) => p.category?.id === c.id).length;
              const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.name}</span>
                    <span className="text-slate-400">{count} products</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
