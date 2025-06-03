"use client"

import { useState } from "react"
import { LogOut, Monitor, Smartphone, Laptop, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

const activeSessions = [
  {
    id: "1",
    device: "Desktop",
    browser: "Chrome 112.0.5615",
    os: "Windows 11",
    ip: "192.168.1.1",
    location: "New York, USA",
    lastActive: "2023-05-15T14:30:00Z",
    current: true,
  },
  {
    id: "2",
    device: "Mobile",
    browser: "Safari 16.4",
    os: "iOS 16.4",
    ip: "203.0.113.45",
    location: "Boston, USA",
    lastActive: "2023-05-15T13:45:00Z",
    current: false,
  },
  {
    id: "3",
    device: "Tablet",
    browser: "Firefox 112.0.1",
    os: "iPadOS 16.3",
    ip: "198.51.100.72",
    location: "Chicago, USA",
    lastActive: "2023-05-14T19:20:00Z",
    current: false,
  },
  {
    id: "4",
    device: "Laptop",
    browser: "Edge 112.0.1722",
    os: "macOS 13.3",
    ip: "172.16.254.1",
    location: "San Francisco, USA",
    lastActive: "2023-05-13T10:15:00Z",
    current: false,
  },
]

export function AdminSessionManagement() {
  const [sessionTimeout, setSessionTimeout] = useState(30)

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop":
        return <Monitor className="h-4 w-4" />
      case "Mobile":
        return <Smartphone className="h-4 w-4" />
      case "Tablet":
      case "Laptop":
        return <Laptop className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Session Settings</CardTitle>
          <CardDescription>Configure session timeout and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <span className="text-sm font-medium">{sessionTimeout} minutes</span>
              </div>
              <Slider
                id="session-timeout"
                min={5}
                max={120}
                step={5}
                value={[sessionTimeout]}
                onValueChange={(value) => setSessionTimeout(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Inactive sessions will be automatically terminated after this period.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="concurrent-sessions">Limit Concurrent Sessions</Label>
                  <div className="text-sm text-muted-foreground">Restrict users to a single active session</div>
                </div>
                <Switch id="concurrent-sessions" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restriction">IP Address Restriction</Label>
                  <div className="text-sm text-muted-foreground">Restrict access to specific IP addresses</div>
                </div>
                <Switch id="ip-restriction" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                <Input id="allowed-ips" placeholder="e.g., 192.168.1.1, 10.0.0.0/24" disabled />
                <p className="text-sm text-muted-foreground">Enter IP addresses or CIDR ranges separated by commas.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>View and manage all active admin sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser / OS</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device)}
                        <span>{session.device}</span>
                        {session.current && (
                          <Badge variant="outline" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.browser}
                      <br />
                      <span className="text-xs text-muted-foreground">{session.os}</span>
                    </TableCell>
                    <TableCell>{session.ip}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {session.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatLastActive(session.lastActive)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={session.current}
                        className={session.current ? "opacity-50" : ""}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Terminate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Terminate All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
