import { db } from '../../db/db.ts'
import { useLiveQuery } from 'dexie-react-hooks'

function Summary() {
    const accounts = useLiveQuery(() => db.accounts.toArray());
    var totalBalance = 0;
    if(accounts && accounts.length>0){
        accounts.forEach( acc => {
        if(acc.balance != undefined)
            totalBalance+=acc.balance
        })
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
          <div style={{ background: '#6200ee', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
            Total balance:
            {totalBalance}
          </div>
        </header>
        </div>
    )
}

export default Summary     