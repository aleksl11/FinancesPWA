import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from '../../../db/db.ts'
import { useLiveQuery } from 'dexie-react-hooks';

function SummaryPieChart({ expenseData }: { expenseData: any }) {
    const categories = useLiveQuery(() => db.categories.toArray())

    const totalsMap = (expenseData ?? []).reduce(
        (acc, expense) => {
            const categoryId = expense.categoryId;

            acc[categoryId] =
                (acc[categoryId] ?? 0) + expense.amount;

            return acc;
        },
        {} as Record<number, number>
    );

    const categoryTotals =
        categories?.map((category) => ({
            id: category.id,
            name: category.name,
            color: category.color,
            value: totalsMap[category.id] ?? 0,
        })) ?? [];

    const data = categoryTotals
        .filter((item) => Number(item.value) > 0)
        .map((item) => ({
            label: item.name,
            value: item.value,
            color: item.color
        }))

    console.log(data)

    return(
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-2 border-b border-slate-50 flex flex-row items-center justify-center bg-white">
                <div className="flex items-center gap-6">
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            Expenses by category
                        </span>
                    </div>

                </div>
            </CardHeader>

            <CardContent className="p-2 pt-6">
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-full h-[250px]">
                        <PieChart
                        series={[
                            { 
                                innerRadius: 40, 
                                outerRadius: 85, 
                                paddingAngle: 2,
                                cornerRadius: 3,
                                data, 
                                arcLabel: (item) => `${item.value}` ,
                                cx: "50%"
                            }
                        ]}
                        height={350} 
                        margin={{ top: 0, bottom: 150, left: 0, right: 0 }}
                        slotProps={{
                            legend: { hidden: true }
                        }}
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-sm" 
                                    style={{ backgroundColor: item.color }} 
                                />
                                <span className="text-xs font-medium text-slate-600">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SummaryPieChart