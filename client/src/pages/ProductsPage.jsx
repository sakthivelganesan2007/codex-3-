import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { Filter, Search, SlidersHorizontal, Scale, X, Sparkles } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'recommended';
  const maxPriceParam = searchParams.get('maxPrice') || '150000';

  const { compareList, clearCompare } = useStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts({
        category: categoryParam,
        search: searchParam,
        sort: sortParam,
        maxPrice: maxPriceParam
      });
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, [categoryParam, searchParam, sortParam, maxPriceParam]);

  const categories = [
    { name: 'All Products', slug: 'all' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Monitors', slug: 'monitors' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Productivity', slug: 'productivity' },
  ];

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-2">
            Product Catalog Discovery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover hardware, peripherals, and complete developer setups with real-time stock & specs
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter('category', cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryParam === cat.slug
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter catalog..."
            value={searchParam}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Price Slider & Sorting */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-mono">Max Price: ₹{Number(maxPriceParam).toLocaleString('en-IN')}</span>
            <input
              type="range"
              min="2000"
              max="150000"
              step="5000"
              value={maxPriceParam}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="recommended">AI Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-slate-900/30 rounded-3xl border border-slate-800">
          <p className="text-base font-bold text-slate-300">No products found matching your filter criteria.</p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-xl text-xs font-bold hover:bg-slate-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Floating Active Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl glass-panel border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>{compareList.length} Product(s) Selected for Compare</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/compare')}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            >
              Compare Matrix →
            </button>
            <button
              onClick={clearCompare}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
