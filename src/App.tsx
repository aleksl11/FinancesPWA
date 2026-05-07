import './App.css'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import Incomes from './pages/incomes/incomes.tsx';
import Categories from './pages/categories/Categories.tsx';
import Summary from './pages/summary/Summary.tsx';
import Expenses from './pages/expenses/expenses.tsx';
import Accounts from './pages/accounts/accounts.tsx';
import Settings from './pages/settings/Settings.tsx';
import { cn } from './lib/utils.ts';

function App() {
  const navItems = [
    { to: "/summary", label: "Summary" },
    { to: "/incomes", label: "Incomes" },
    { to: "/expenses", label: "Expenses" },
    { to: "/categories", label: "Categories" },
    { to: "/accounts", label: "Accounts" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#f4f7f6] font-sans">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center px-4 h-16">
            {/* Logo/Title - hidden on very small screens to save space */}
            <div className="hidden sm:block font-bold text-[#005014] text-xl mr-8">
              Finances
            </div>
            
            {/* Scrollable Container */}
            <div className="flex flex-1 items-center space-x-1 overflow-x-auto pb-2 pt-2 scrollbar-hide">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      // whitespace-nowrap is the secret sauce here
                      "px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
                      isActive 
                        ? "bg-[#005014] text-white" 
                        : "text-slate-600 hover:text-[#005014] hover:bg-slate-100"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl p-6">
          <Routes>
            <Route path="/summary" element={<Summary />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
