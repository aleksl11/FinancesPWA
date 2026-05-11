import { BarChart } from '@mui/x-charts/BarChart';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SummaryBarChart({ accountData = { incomeData: [], expenseData: [] } }: { accountData: any }) {

    const currentYear = new Date().getFullYear()
    const [year, setYear] = useState(currentYear);

    const prepareMonthlyData = (data: any[], year: number) => {
        const monthlyTotals = new Array(12).fill(0);

        data.forEach((item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getFullYear() === year) {
            const month = itemDate.getMonth(); // 0 = Jan, 11 = Dec
            monthlyTotals[month] += item.amount;
            }
        });

        return monthlyTotals;
    };

    const incomes = prepareMonthlyData(accountData.incomeData ?? [], year);
    const expenses = prepareMonthlyData(accountData.expenseData ?? [], year);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return(
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-2 border-b border-slate-50 flex flex-row items-center justify-center bg-white">
                <div className="flex items-center gap-6">
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-[#005014] hover:bg-slate-50 active:scale-95 transition-transform"
                        onClick={() => setYear(year - 1)}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            Year
                        </span>
                        <span className="text-base font-black text-slate-900 tabular-nums leading-none">
                            {year}
                        </span>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-[#005014] hover:bg-slate-50 disabled:opacity-20 active:scale-95 transition-transform"
                        onClick={() => setYear(year + 1)}
                        disabled={year >= currentYear}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-2 pt-6">
                <div className="w-full h-[300px]">
                    <BarChart
                    
                        xAxis={[
                            {
                                id: 'monthAxis',
                                data: months,
                                scaleType: 'band',
                                categoryGapRatio: 0.3,
                                barGapRatio: 0.1,
                            }
                        ]}
                        series={[
                            {
                                label: 'Incomes',
                                data: incomes,
                                color: '#005014', 
                            },
                            {
                                label: 'Expenses',
                                data: expenses,
                                color: '#ef4444', 
                            }
                        ]}

                        margin={{ top: 10, bottom: 30, left: -10, right: 10 }}
                        slotProps={{
                            legend: {
                                //direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'center' },
                                //padding: -5,
                                //labelStyle: { fontSize: 10, fontWeight: 600, fill: '#64748b' }
                            }
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default SummaryBarChart