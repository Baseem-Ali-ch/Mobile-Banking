"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

export function SystemPerformance() {
  // Mock data for system performance metrics
  const systemMetrics = {
    uptime: 99.98,
    responseTime: {
      average: 245,
      p95: 350,
      p99: 450,
    },
    errorRate: 0.02,
    cpuUsage: 42,
    memoryUsage: 58,
    diskUsage: 35,
    networkUsage: 28,
    activeConnections: 1250,
    requestsPerMinute: 850,
    timeSeriesData: [
      { time: "00:00", responseTime: 220, errorRate: 0.01, requests: 720 },
      { time: "04:00", responseTime: 215, errorRate: 0.0, requests: 680 },
      { time: "08:00", responseTime: 280, errorRate: 0.03, requests: 920 },
      { time: "12:00", responseTime: 310, errorRate: 0.04, requests: 1050 },
      { time: "16:00", responseTime: 290, errorRate: 0.02, requests: 980 },
      { time: "20:00", responseTime: 240, errorRate: 0.01, requests: 820 },
    ],
    incidents: [
      {
        id: "INC-001",
        title: "API Latency Spike",
        time: "2023-05-15T14:30:00Z",
        duration: 15, // minutes
        status: "resolved",
        impact: "minor",
      },
      {
        id: "INC-002",
        title: "Database Connection Issues",
        time: "2023-05-10T08:45:00Z",
        duration: 45, // minutes
        status: "resolved",
        impact: "major",
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>System Response Time</CardTitle>
            <CardDescription>Average response time over the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                responseTime: {
                  label: "Response Time (ms)",
                  color: "hsl(var(--chart-1))",
                },
                requests: {
                  label: "Requests per Minute",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemMetrics.timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="responseTime"
                    stroke="var(--color-responseTime)"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="requests" stroke="var(--color-requests)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Uptime</CardTitle>
            <CardDescription>Current system availability status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm font-medium">{systemMetrics.uptime}%</span>
            </div>
            <Progress value={systemMetrics.uptime} className="h-2 mb-4" />
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-4 w-4 mr-1" /> Operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>Current system resource utilization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">CPU</span>
                <span className="text-sm font-medium">{systemMetrics.cpuUsage}%</span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Memory</span>
                <span className="text-sm font-medium">{systemMetrics.memoryUsage}%</span>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Disk</span>
                <span className="text-sm font-medium">{systemMetrics.diskUsage}%</span>
              </div>
              <Progress value={systemMetrics.diskUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Percentage of failed requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Error Rate</span>
              <span className="text-sm font-medium">{systemMetrics.errorRate}%</span>
            </div>
            <Progress value={systemMetrics.errorRate * 100} className="h-2 mb-4" />
            <div className="flex justify-center">
              {systemMetrics.errorRate < 0.05 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" /> Normal
                </Badge>
              ) : systemMetrics.errorRate < 0.1 ? (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertCircle className="h-4 w-4 mr-1" /> Elevated
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="h-4 w-4 mr-1" /> Critical
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>System incidents in the selected time period.</CardDescription>
        </CardHeader>
        <CardContent>
          {systemMetrics.incidents.length > 0 ? (
            <div className="space-y-4">
              {systemMetrics.incidents.map((incident) => (
                <div key={incident.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={
                          incident.impact === "minor"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)}
                      </Badge>
                      <span className="ml-2 font-medium">{incident.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        incident.status === "resolved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>
                      {new Date(incident.time).toLocaleString()} • Duration: {incident.duration} minutes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No incidents reported in the selected time period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
