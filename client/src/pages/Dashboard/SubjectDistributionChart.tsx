import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import statisticsService from '../../services/statistics.service';

interface SubjectDistributionData {
    name: string;
    value: number; // Represents count or percentage
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919']; // Add more colors if needed

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    // const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    // const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const labelRadius = outerRadius + 10; // Position label outside the pie
    const lx = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const ly = cy + labelRadius * Math.sin(-midAngle * RADIAN);


    return (
        <text
            x={lx}
            y={ly}
            fill="black"
            textAnchor={lx > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="12px"
        >
            {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function SubjectDistributionChart() {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState<SubjectDistributionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjectData = async () => {
            try {
                setLoading(true);
                const data = await statisticsService.getSubjectDistribution(); // This function will be created
                setChartData(data);
                setError(null);
            } catch (err) {
                setError(t('common.errorFetchingData'));
                console.error("Error fetching subject distribution:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjectData();
    }, [t]);

    if (loading) {
        return <div className="text-center p-4">{t('common.loading')}</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    if (!chartData || chartData.length === 0) {
        return <div className="text-center p-4">{t('common.noData')}</div>;
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-center">{t('dashboard.subjectDistribution')}</h2> {/* New translation key */}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={renderCustomizedLabel}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value} ${t('dashboard.studentsCountAbbr')}`, name]} />
                    <Legend payload={chartData.map((entry, index) => ({ value: entry.name, type: 'square', color: COLORS[index % COLORS.length] }))} />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
}

export default SubjectDistributionChart;