import { db } from '../../db/db.ts'
import { useLiveQuery } from 'dexie-react-hooks'
import SummaryBarChart from './charts/SummaryBarChart.tsx';

function Summary() {
    const accounts = useLiveQuery(() => db.accounts.toArray());
    const incomes = useLiveQuery(() => db.incomes.toArray());
    const expenses = useLiveQuery(() => db.expenses.toArray());
    var totalBalance = 0;
    if(accounts && accounts.length>0){
        accounts.forEach( acc => {
        if(acc.balance != undefined)
            totalBalance+=acc.balance
        })
    }
    var accountData = {
      incomeData: incomes,
      expenseData: expenses
    }

    return (
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          background: '#f4f7f6',
          fontFamily: 'system-ui' 
        }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px' }}>My Finances</h1>
          <div style={{ background: '#004109', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
            Total balance: {totalBalance}PLN
          </div>
        </header>
        <SummaryBarChart accountData={accountData}></SummaryBarChart>
        </div>
    )
}

export default Summary     