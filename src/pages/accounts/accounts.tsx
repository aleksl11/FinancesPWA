import { useState } from 'react';
import { db } from '../../db/db.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, AlertCircle, Banknote } from "lucide-react"; 
import { cn } from "@/lib/utils";

function Accounts() {
    const accounts = useLiveQuery(() => db.accounts.toArray());
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [accountToDelete, setAccountToDelete] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        await db.accounts.add({ name, balance: Number(balance) || 0 });
        setName(''); setBalance(''); setShowForm(false);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) || 0;

    return (
        /* Reduced horizontal padding from px-6 to px-2 on mobile */
        <div className="space-y-4 px-1 sm:px-4">
            
            {/* 1. Compact Summary Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Balance</p>
                        <p className={cn("text-2xl font-black tracking-tight", totalBalance < 0 ? 'text-red-600' : 'text-[#005014]')}>
                            {formatCurrency(totalBalance)}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-full">
                        <Banknote className="h-5 w-5 text-slate-400" />
                    </div>
                </div>
            </Card>

            {/* 2. Compact Header */}
            <div className="flex items-center justify-between px-1">
                <h1 className="text-xl font-bold text-slate-900">Accounts</h1>
                <Button 
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="bg-[#005014] hover:bg-[#004010] text-white h-8 px-3 text-xs"
                >
                    <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
            </div>

            {/* 3. Compact List */}
            <section className="grid gap-2">
                {!accounts ? (
                    <p className="text-center py-10 text-slate-500 text-xs">Loading...</p>
                ) : accounts.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <p className="text-slate-400 text-xs">No accounts yet.</p>
                    </div>
                ) : (
                    accounts.map(a => (
                        <Card key={a.id} className="border-none shadow-sm bg-white">
                            <CardContent className="p-3 flex justify-between items-center">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-600 truncate">{a.name}</p>
                                    <p className={`text-base font-bold tabular-nums ${a.balance < 0 ? 'text-red-500' : 'text-[#005014]'}`}>
                                        {formatCurrency(a.balance)}
                                    </p>
                                </div>
                                {/* Icon is now ALWAYS visible (opacity-100) and colored for visibility */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-300 hover:text-red-500 h-8 w-8"
                                    onClick={() => setAccountToDelete(a)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>

            {/* 4. Improved Modal (Fixed Blur and Visibility) */}
            {(showForm || accountToDelete) && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-[2px]">
                    {showForm && (
                        <Card className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] border-none shadow-2xl animate-in slide-in-from-bottom duration-300 bg-white">
                            <CardHeader className="p-4 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold">New Account</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase">Name</label>
                                    <Input
                                        autoFocus
                                        placeholder="Savings, Cash, etc."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#005014]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase">Balance</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        className="h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#005014]"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="secondary" className="flex-1 text-xs" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button className="flex-1 bg-[#005014] text-white text-xs" onClick={handleSubmit}>Create</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {accountToDelete && (
                        <Card className="w-full max-w-[90%] sm:max-w-sm rounded-[20px] border-none shadow-2xl bg-white m-4">
                            <CardContent className="p-6 text-center">
                                <AlertCircle className="mx-auto text-red-500 h-8 w-8 mb-3" />
                                <h2 className="text-lg font-bold">Delete Account?</h2>
                                <p className="text-slate-400 text-xs mt-1 mb-6">This will remove <span className="text-slate-900 font-bold">{accountToDelete.name}</span>.</p>
                                <div className="flex gap-2">
                                    <Button variant="secondary" className="flex-1 h-9 text-xs" onClick={() => setAccountToDelete(null)}>Cancel</Button>
                                    <Button variant="destructive" className="flex-1 h-9 text-xs" onClick={async () => {
                                        await db.accounts.delete(accountToDelete.id);
                                        setAccountToDelete(null);
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

export default Accounts;