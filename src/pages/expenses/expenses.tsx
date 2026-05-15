import { useState } from 'react';
import { db } from '../../db/db.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Receipt, Calendar, Wallet, Tag, AlertCircle } from "lucide-react";

function Expenses() {
    // We need accounts and categories for the "Add" form dropdowns
    const expenses = useLiveQuery(() => db.expenses.orderBy('date').reverse().toArray());
    const accounts = useLiveQuery(() => db.accounts.toArray());
    const categories = useLiveQuery(() => db.categories.toArray());

    const [showForm, setShowForm] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !accountId) return;

        await db.expenses.add({
            title,
            amount: Number(amount),
            date: new Date(date),
            accountId: Number(accountId),
            categoryId: Number(categoryId),
            description: "" // Optional field
        });

        const account = await db.accounts.get(Number(accountId));

        if (account) {
            await db.accounts.update(Number(accountId), {
                balance: account.balance - Number(amount)
            });
        }

        // Reset form
        setTitle(''); setAmount(''); setAccountId(''); setCategoryId('');
        setShowForm(false);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PLN' }).format(val);
    };

    return (
        <div className="space-y-4 px-1 sm:px-4">
            
            {/* 1. Header */}
            <div className="flex items-center justify-between px-1 pt-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Recent spending</p>
                </div>
                <Button 
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="bg-[#005014] hover:bg-[#004010] text-white h-8 px-3 text-xs"
                >
                    <Plus className="mr-1 h-3 w-3" /> Add Expense
                </Button>
            </div>

            {/* 2. List of Expenses */}
            <section className="grid gap-2">
                {!expenses ? (
                    <p className="text-center py-10 text-slate-500 text-xs">Loading...</p>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Receipt className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                        <p className="text-slate-400 text-xs">No expenses logged yet.</p>
                    </div>
                ) : (
                    expenses.map(e => (
                        <Card key={e.id} className="border-none shadow-sm bg-white">
                            <CardContent className="p-3 flex justify-between items-center">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-bold text-slate-900 truncate">{e.title}</p>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                                            {e.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Wallet className="h-2.5 w-2.5" /> 
                                        {accounts?.find(a => a.id === e.accountId)?.name || 'Unknown Account'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-red-500 tabular-nums">
                                        -{formatCurrency(e.amount)}
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-slate-200 hover:text-red-500 h-8 w-8"
                                        onClick={() => setExpenseToDelete(e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>

            {/* 3. Add Expense Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                    <Card className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] border-none shadow-2xl animate-in slide-in-from-bottom duration-300 bg-white">
                        <div className="p-5 space-y-4">
                            <h2 className="text-lg font-bold">Log Expense</h2>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                                    <Input placeholder="What did you buy?" value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-50 border-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Amount</label>
                                        <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="bg-slate-50 border-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-slate-50 border-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Account</label>
                                        <select 
                                            value={accountId} 
                                            onChange={e => setAccountId(e.target.value)}
                                            className="w-full h-10 px-3 text-sm bg-slate-50 rounded-md border-none outline-none focus:ring-1 focus:ring-[#005014]"
                                        >
                                            <option value="">Select...</option>
                                            {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                                        <select 
                                            value={categoryId} 
                                            onChange={e => setCategoryId(e.target.value)}
                                            className="w-full h-10 px-3 text-sm bg-slate-50 rounded-md border-none outline-none focus:ring-1 focus:ring-[#005014]"
                                        >
                                            <option value="">Select...</option>
                                            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button className="flex-1 bg-[#005014] text-white" onClick={handleSubmit}>Save Expense</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* 4. Delete Confirmation */}
            {expenseToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                    <Card className="w-full max-w-[85%] sm:max-w-sm rounded-[20px] border-none shadow-2xl bg-white p-6 text-center">
                        <AlertCircle className="mx-auto text-red-500 h-8 w-8 mb-3" />
                        <h2 className="text-lg font-bold">Delete Expense?</h2>
                        <p className="text-slate-400 text-xs mt-1 mb-6">Remove "{expenseToDelete.title}" from your records?</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1" onClick={() => setExpenseToDelete(null)}>Cancel</Button>
                            <Button variant="destructive" className="flex-1" onClick={async () => {
                                const account = await db.accounts.get(expenseToDelete.accountId);

                                if (account) {
                                    await db.accounts.update(expenseToDelete.accountId, {
                                        balance: account.balance + expenseToDelete.amount
                                    });
                                }

                                await db.expenses.delete(expenseToDelete.id);
                                setExpenseToDelete(null);
                            }}>Delete</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Expenses;