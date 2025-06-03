"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UserGrowthChart() {
  const { data } = useAppSelector((state) => state.reports.userGrowth)

  // Mock data for demonstration
  const mockData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Users",
        data: [30, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
      },
      {
        label: "Active Users",
        data: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320],
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

  // Calculate cumulative new users
  const cumulativeData = chartData.labels.map((label, index) => {
    const dataPoint: any = { name: label }
    let cumulativeSum = 0
    chartData.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.label === "New Users") {
        for (let i = 0; i <= index; i++) {
          cumulativeSum += dataset.data[i]
        }
        dataPoint["Cumulative Users"] = cumulativeSum
      } else {
        dataPoint[dataset.label] = dataset.data[index]
      }
    })
    return dataPoint
  })

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Analysis of new and active users over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly" className="space-y-4">
            <ChartContainer
              config={{
                "New Users": {
                  label: "New Users",
                  color: "hsl(var(--chart-1))",
                },
                "Active Users": {
                  label: "Active Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="New Users"
                    stackId="1"
                    stroke="var(--color-New Users)"
                    fill="var(--color-New Users)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="Active Users"
                    stackId="2"
                    stroke="var(--color-Active Users)"
                    fill="var(--color-Active Users)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="cumulative" className="space-y-4">
            <ChartContainer
              config={{
                "Cumulative Users": {
                  label: "Cumulative Users",
                  color: "hsl(var(--chart-1))",
                },
                "Active Users": {
                  label: "Active Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Cumulative Users"
                    stackId="1"
                    stroke="var(--color-Cumulative Users)"
                    fill="var(--color-Cumulative Users)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="Active Users"
                    stackId="2"
                    stroke="var(--color-Active Users)"
                    fill="var(--color-Active Users)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total New Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transformedData.reduce((acc, curr) => acc + curr["New Users"], 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">New users in selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  transformedData.reduce((acc, curr) => acc + curr["Active Users"], 0) / transformedData.length,
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Average monthly active users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  ((transformedData[transformedData.length - 1]["New Users"] - transformedData[0]["New Users"]) /
                    transformedData[0]["New Users"]) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Growth from first to last period</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
