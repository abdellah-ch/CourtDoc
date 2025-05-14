'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function StatisticsPage({ params }: { params: { id: string } }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const router = useRouter()

  const { id } = useParams()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = `/api/statistics/${id}`
        if (dateRange) {
          const [start, end] = dateRange
          url += `?startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch statistics')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [id, dateRange])

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[50vh]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center h-[50vh]">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-red-500">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Prepare data for charts
  const statusData = [
    { name: 'منجز', value: stats.completedMessages },
    { name: 'غير منجز', value: stats.pendingMessages }
  ]

  const monthlyChartData = Object.entries(stats.monthlyData).map(([month, count]) => ({
    month,
    count
  }))

  // Add "وارد_صادر" to message types if not present
  const messageTypes = [...stats.types]
  if (!messageTypes.some((t: any) => t.typeName === 'وارد_صادر')) {
    messageTypes.push({
      typeId: -1,
      typeName: 'وارد_صادر',
      count: 0
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-right">إحصائيات الشعبة</h1>
        <RangePicker
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          format="YYYY-MM-DD"
          className="text-right"
          placeholder={['تاريخ البدء', 'تاريخ الانتهاء']}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-right">إجمالي المراسلات</h3>
          <p className="text-3xl font-bold text-primary mt-2">{stats.totalMessages}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-right">المراسلات المنجزة</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">{stats.completedMessages}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-right">المراسلات غير المنجزة</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingMessages}</p>
        </div>
      </div>

      {/* Status Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-right">حالة المراسلات</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-right">الاتجاه الشهري للمراسلات</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="عدد المراسلات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prosecutors Table - Updated version */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-right"> نشاط السادة النواب </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النائب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">منجز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">غير منجز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نسبة الإنجاز</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.prosecutors.map((prosecutor: any, index: number) => {
                const total = prosecutor.completed + prosecutor.pending
                const completionRate = total > 0 ? Math.round((prosecutor.completed / total) * 100) : 0
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{prosecutor.prosecutorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{prosecutor.completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{prosecutor.pending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${completionRate >= 80 ? 'bg-green-100 text-green-800' : completionRate >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {completionRate}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Types - Updated with "وارد_صادر" */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-right">أنواع المراسلات</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={messageTypes}
              margin={{ left: 40, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="typeName" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="عدد المراسلات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Subjects */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-right">أهم المواضيع</h3>
        <div className="space-y-2">
          {stats.subjects.map((subject: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-right flex-1 truncate">{subject.Sujet || 'بدون موضوع'}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {subject._count._all} مراسلة
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}