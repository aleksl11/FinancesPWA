
function Settings() {
    return (
        <div className="settings">
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            background: '#f4f7f6',
            fontFamily: 'system-ui' 
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px' }}>My Finances</h1>
            </header>
            
            <section>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Settings</h3>
            </section>
        </div>
        </div>
    )
}

export default Settings