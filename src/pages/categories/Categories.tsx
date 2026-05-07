import { useState } from 'react';
import { db } from '../../db/db.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Tag, AlertCircle } from "lucide-react";

function Categories() {
    const categories = useLiveQuery(() => db.categories.toArray());
    
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#005014'); // Default to brand green
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        await db.categories.add({
            name,
            color
        });

        setName('');
        setShowForm(false);
    };

    // Predefined colors for the user to pick from
    const colorOptions = ['#005014', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-4 px-1 sm:px-4">
            
            {/* 1. Compact Header */}
            <div className="flex items-center justify-between px-1 pt-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Categories</h1>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Organize your spending</p>
                </div>
                <Button 
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="bg-[#005014] hover:bg-[#004010] text-white h-8 px-3 text-xs"
                >
                    <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
            </div>

            {/* 2. Compact Grid of Categories */}
            <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {!categories ? (
                    <p className="text-center py-10 text-slate-500 text-xs">Loading...</p>
                ) : categories.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Tag className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                        <p className="text-slate-400 text-xs">No categories yet.</p>
                    </div>
                ) : (
                    categories.map(cat => (
                        <Card key={cat.id} className="border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-3 flex justify-between items-center">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Color Indicator */}
                                    <div 
                                        className="h-3 w-3 rounded-full flex-shrink-0" 
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="text-sm font-semibold text-slate-700 truncate">
                                        {cat.name}
                                    </span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-300 hover:text-red-500 h-8 w-8"
                                    onClick={() => setCategoryToDelete(cat)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>

            {/* 3. Modal Overlay */}
            {(showForm || categoryToDelete) && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-[2px]">
                    
                    {/* ADD CATEGORY FORM */}
                    {showForm && (
                        <Card className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] border-none shadow-2xl animate-in slide-in-from-bottom duration-300 bg-white">
                            <CardHeader className="p-4 border-b border-slate-50">
                                <h2 className="text-lg font-bold">New Category</h2>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase">Category Name</label>
                                    <Input
                                        autoFocus
                                        placeholder="e.g. Groceries"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#005014]"
                                    />
                                </div>

                                {/* Color Picker logic */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase">Label Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {colorOptions.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={`h-8 w-8 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-slate-900' : 'border-transparent'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="secondary" className="flex-1 text-xs" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button className="flex-1 bg-[#005014] text-white text-xs" onClick={handleSubmit}>Save Category</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* DELETE CONFIRMATION */}
                    {categoryToDelete && (
                        <Card className="w-full max-w-[90%] sm:max-w-sm rounded-[20px] border-none shadow-2xl bg-white m-4">
                            <CardContent className="p-6 text-center">
                                <AlertCircle className="mx-auto text-red-500 h-8 w-8 mb-3" />
                                <h2 className="text-lg font-bold">Delete Category?</h2>
                                <p className="text-slate-400 text-xs mt-1 mb-6">
                                    Removing <span className="text-slate-900 font-bold">{categoryToDelete.name}</span> will affect transaction labeling.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="secondary" className="flex-1 h-9 text-xs" onClick={() => setCategoryToDelete(null)}>Cancel</Button>
                                    <Button variant="destructive" className="flex-1 h-9 text-xs" onClick={async () => {
                                        await db.categories.delete(categoryToDelete.id);
                                        setCategoryToDelete(null);
                                    }}>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default Categories;