import { db } from '../../db/db.ts'
import { useLiveQuery } from 'dexie-react-hooks'
import SummaryBarChart from './charts/SummaryBarChart.tsx';
import SummaryPieChart from './charts/SummaryPieChart.tsx';
import { useMemo, useState } from 'react';

function Summary() {
    const accounts = useLiveQuery(() => db.accounts.toArray());
    const incomes = useLiveQuery(() => db.incomes.toArray());
    const expenses = useLiveQuery(() => db.expenses.toArray());

    const [selectedAccountId, setSelectedAccountId] = useState<number | 'all'>('all');
    
    const filteredIncomes = useMemo(() => {
        if (selectedAccountId === 'all') {
            return incomes ?? [];
        }

        return (incomes ?? []).filter(
            (income) => income.accountId === selectedAccountId
        );
    }, [incomes, selectedAccountId]);

    const filteredExpenses = useMemo(() => {
        if (selectedAccountId === 'all') {
            return expenses ?? [];
        }

        return (expenses ?? []).filter(
            (expense) => expense.accountId === selectedAccountId
        );
    }, [expenses, selectedAccountId]);

    var totalBalance = 0;

    if(accounts && accounts.length>0){
		if(selectedAccountId === 'all'){
			accounts.forEach( acc => {
				if(acc.balance != undefined)
					totalBalance+=acc.balance
			})
		}
		else{
			const selectedAccount = accounts.find(
				(acc) => acc.id === selectedAccountId
			);

			totalBalance = selectedAccount?.balance ?? 0;
		}
    }

    var accountData = {
        incomeData: filteredIncomes,
        expenseData: filteredExpenses
    }

    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            background: '#f4f7f6',
            fontFamily: 'system-ui' 
        }}>

            <header  className="flex flex-col gap-4 mb-[30px]">
				<div className="flex items-center gap-3 flex-wrap">
					<span className="text-sm font-medium text-slate-600">
						Filter by account:
					</span>

					<select
						value={selectedAccountId}
						onChange={(e) => {
							const value = e.target.value;

							setSelectedAccountId(
								value === 'all'
									? 'all'
									: Number(value)
							);
						}}
						className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
					>
						<option value="all">
							All Accounts
						</option>

						{(accounts ?? []).map((account) => (
							<option
								key={account.id}
								value={account.id}
							>
								{account.name}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-center gap-3 flex-row">
					<h1 className="text-2xl font-semibold">My Finances</h1>
					<div className="bg-[#004109] text-white px-5 py-2.5 rounded-lg shadow-sm">
						Total balance: {totalBalance}PLN
					</div>
				</div>
            </header>

            <div className="space-y-6 px-1 sm:px-4">
                <SummaryBarChart accountData={accountData}></SummaryBarChart>
                <SummaryPieChart expenseData={filteredExpenses}></SummaryPieChart>
            </div>
        </div>
    )
}

export default Summary     