"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { LineChart, Line } from "recharts"

export function TransactionVolumeChart() {
  const { data } = useAppSelector((state) => state.reports.transactionVolume)

  // Mock data for demonstration
  const mockData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90],
      },
      {
        label: "Pending",
        data: [28, 48, 40, 19, 86, 27, 90, 35, 40, 45, 50, 55],
      },
      {
        label: "Failed",
        data: [10, 15, 8, 12, 7, 11, 5, 8, 10, 12, 15, 10],
      },
    ],
  }

  // Use real data if available, otherwise use mock data
  const chartData = data || mockData

  // Transform data for recharts
  const transformedData = chartData.labels.map((label, index) => {
    const dataPoint: any = { name: label }
    chartData.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index]
    })
    return dataPoint
  })

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Analysis of transaction volume over time, broken down by transaction status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="stacked">Stacked</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bar" className="space-y-4">
            <ChartContainer
              config={{
                Completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-1))",
                },
                Pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-2))",
                },
                Failed: {
                  label: "Failed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Completed" fill="var(--color-Completed)" />
                  <Bar dataKey="Pending" fill="var(--color-Pending)" />
                  <Bar dataKey="Failed" fill="var(--color-Failed)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="line" className="space-y-4">
            <ChartContainer
              config={{
                Completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-1))",
                },
                Pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-2))",
                },
                Failed: {
                  label: "Failed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="Completed" stroke="var(--color-Completed)" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Pending" stroke="var(--color-Pending)" />
                  <Line type="monotone" dataKey="Failed" stroke="var(--color-Failed)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="stacked" className="space-y-4">
            <ChartContainer
              config={{
                Completed: {
                  label: "Completed",
                  color: "hsl(var(--chart-1))",
                },
                Pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-2))",
                },
                Failed: {
                  label: "Failed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Completed" stackId="a" fill="var(--color-Completed)" />
                  <Bar dataKey="Pending" stackId="a" fill="var(--color-Pending)" />
                  <Bar dataKey="Failed" stackId="a" fill="var(--color-Failed)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transformedData
                  .reduce((acc, curr) => acc + curr.Completed + curr.Pending + curr.Failed, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All transactions in selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (transformedData.reduce((acc, curr) => acc + curr.Completed, 0) /
                    transformedData.reduce((acc, curr) => acc + curr.Completed + curr.Pending + curr.Failed, 0)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Percentage of completed transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (transformedData.reduce((acc, curr) => acc + curr.Failed, 0) /
                    transformedData.reduce((acc, curr) => acc + curr.Completed + curr.Pending + curr.Failed, 0)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Percentage of failed transactions</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
