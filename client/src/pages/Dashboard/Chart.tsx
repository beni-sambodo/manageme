import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import statisticsService from '../../services/statistics.service';

interface DailyRegistrationData {
    name: string;
    students: number;
}

function DailyRegistrationsChart() {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState<DailyRegistrationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                const data = await statisticsService.getDailyRegistrations();
                setChartData(data);
                setError(null);
            } catch (err) {
                setError(t('common.errorFetchingData')); // Assuming you have a common translation for this
                console.error("Error fetching daily registrations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [t]);

    if (loading) {
        return <div className="p-4 bg-white border w-full rounded-lg shadow-lg mt-5 text-center">{t('common.loading')}</div>; // Assuming common.loading translation
    }

    if (error) {
        return <div className="p-4 bg-white border w-full rounded-lg shadow-lg mt-5 text-center text-red-500">{error}</div>;
    }

    if (!chartData || chartData.length === 0) {
        return <div className="p-4 bg-white border w-full rounded-lg shadow-lg mt-5 text-center">{t('common.noData')}</div>; // Assuming common.noData translation
    }

    return (
        <div className="p-4 bg-white border w-full rounded-lg shadow-lg mt-5">
            <h1 className="my-2 text-xl font-semibold">
                {t('dashboard.dailyRegistrations')}
            </h1>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#8884d8"
                        activeDot={{ r: 8 }} name={t('dashboard.studentsCount')} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DailyRegistrationsChart;
