import { useState } from 'react';
import { db } from '../../db/db.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, TrendingUp, Wallet, AlertCircle } from "lucide-react";

function Incomes() {
    // Queries
    const incomes = useLiveQuery(() => db.incomes.orderBy('date').reverse().toArray());
    const accounts = useLiveQuery(() => db.accounts.toArray());

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [incomeToDelete, setIncomeToDelete] = useState<any>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [accountId, setAccountId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !accountId) return;

        await db.incomes.add({
            title,
            amount: Number(amount),
            date: new Date(date),
            accountId: Number(accountId),
            description: ""
        });

        // Reset & Close
        setTitle(''); setAmount(''); setAccountId('');
        setShowForm(false);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return (
        <div className="space-y-4 px-1 sm:px-4">
            
            {/* 1. Header */}
            <div className="flex items-center justify-between px-1 pt-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Incomes</h1>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Money received</p>
                </div>
                <Button 
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="bg-[#005014] hover:bg-[#004010] text-white h-8 px-3 text-xs"
                >
                    <Plus className="mr-1 h-3 w-3" /> Add Income
                </Button>
            </div>

            {/* 2. List of Incomes */}
            <section className="grid gap-2">
                {!incomes ? (
                    <p className="text-center py-10 text-slate-500 text-xs">Loading...</p>
                ) : incomes.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <TrendingUp className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                        <p className="text-slate-400 text-xs">No income records yet.</p>
                    </div>
                ) : (
                    incomes.map(i => (
                        <Card key={i.id} className="border-none shadow-sm bg-white">
                            <CardContent className="p-3 flex justify-between items-center">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-bold text-slate-900 truncate">{i.title}</p>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-[#005014] rounded font-bold">
                                            {i.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Wallet className="h-2.5 w-2.5" /> 
                                        {accounts?.find(a => a.id === i.accountId)?.name || 'Unknown Account'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-[#005014] tabular-nums">
                                        +{formatCurrency(i.amount)}
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-slate-200 hover:text-red-500 h-8 w-8"
                                        onClick={() => setIncomeToDelete(i)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>

            {/* 3. Add Income Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                    <Card className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] border-none shadow-2xl animate-in slide-in-from-bottom duration-300 bg-white">
                        <div className="p-5 space-y-4">
                            <h2 className="text-lg font-bold">Add Income</h2>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Source / Title</label>
                                    <Input placeholder="Salary, Bonus, Gift..." value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-50 border-none" />
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

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Deposit To</label>
                                    <select 
                                        value={accountId} 
                                        onChange={e => setAccountId(e.target.value)}
                                        className="w-full h-10 px-3 text-sm bg-slate-50 rounded-md border-none outline-none focus:ring-1 focus:ring-[#005014]"
                                    >
                                        <option value="">Select Account...</option>
                                        {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button className="flex-1 bg-[#005014] text-white" onClick={handleSubmit}>Save Income</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* 4. Delete Confirmation */}
            {incomeToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                    <Card className="w-full max-w-[85%] sm:max-w-sm rounded-[20px] border-none shadow-2xl bg-white p-6 text-center">
                        <AlertCircle className="mx-auto text-red-500 h-8 w-8 mb-3" />
                        <h2 className="text-lg font-bold">Delete Record?</h2>
                        <p className="text-slate-400 text-xs mt-1 mb-6">Remove this income record for "{incomeToDelete.title}"?</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1" onClick={() => setIncomeToDelete(null)}>Cancel</Button>
                            <Button variant="destructive" className="flex-1" onClick={async () => {
                                await db.incomes.delete(incomeToDelete.id);
                                setIncomeToDelete(null);
                            }}>Delete</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Incomes;