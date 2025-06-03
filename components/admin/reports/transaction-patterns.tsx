"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export function TransactionPatterns() {
  const { data } = useAppSelector((state) => state.reports.transactionPatterns)

  // Mock data for demonstration
  const mockData = {
    byCategory: {
      labels: ["Transfer", "Payment", "Deposit", "Withdrawal", "Fee", "Refund", "Other"],
      data: [40, 25, 15, 10, 5, 3, 2],
    },
    byTimeOfDay: {
      labels: ["12am-4am", "4am-8am", "8am-12pm", "12pm-4pm", "4pm-8pm", "8pm-12am"],
      data: [5, 10, 30, 25, 20, 10],
    },
    byDayOfWeek: {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      data: [15, 20, 18, 17, 25, 10, 5],
    },
  }

  // Use real data if available, otherwise use mock data
  const patternsData = data || mockData

  // Transform category data for recharts
  const categoryData = patternsData.byCategory.labels.map((label, index) => ({
    name: label,
    value: patternsData.byCategory.data[index],
  }))

  // Transform time of day data for recharts
  const timeOfDayData = patternsData.byTimeOfDay.labels.map((label, index) => ({
    name: label,
    value: patternsData.byTimeOfDay.data[index],
  }))

  // Transform day of week data for recharts
  const dayOfWeekData = patternsData.byDayOfWeek.labels.map((label, index) => ({
    name: label,
    value: patternsData.byDayOfWeek.data[index],
  }))

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Transaction Categories</CardTitle>
          <CardDescription>Distribution of transactions by category.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} transactions`, "Volume"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions by Time of Day</CardTitle>
          <CardDescription>When transactions are most frequently processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Transactions",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions by Day of Week</CardTitle>
          <CardDescription>Transaction volume patterns across days of the week.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Transactions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
