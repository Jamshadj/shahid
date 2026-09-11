'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '@/lib/data-service';
import { Category } from '@/types/database';
import { Plus, Trash2, Layers, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await createCategory(newCatName.trim());
      toast.success(`Category '${newCatName}' created!`);
      setNewCatName('');
      loadCategories();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category removed');
      loadCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h1>
        <p className="text-xs text-slate-500 mt-1">Organize food dishes into structured menu categories</p>
      </div>

      {/* Add New Category Form */}
      <form onSubmit={handleAddCategory} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
        <label className="block text-xs font-bold text-slate-700">Create New Category</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Tandoori Specials, Desserts, Mocktails"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" /> Active Categories
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {categories.length} total
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-900 text-base">{cat.name}</span>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
