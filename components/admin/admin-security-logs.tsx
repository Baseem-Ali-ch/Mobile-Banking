"use client"

import type React from "react"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Clock, Download, Filter, Search, Shield, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const securityLogs = [
  {
    id: "1",
    event: "Login Success",
    user: "admin@gmail.com",
    ip: "192.168.1.1",
    location: "New York, USA",
    timestamp: "2023-05-15T14:30:00Z",
    details: "Successful login via password",
    severity: "info",
  },
  {
    id: "2",
    event: "Login Failed",
    user: "admin@gmail.com",
    ip: "203.0.113.45",
    location: "Unknown Location",
    timestamp: "2023-05-15T14:25:00Z",
    details: "Invalid password (Attempt 1 of 5)",
    severity: "warning",
  },
  {
    id: "3",
    event: "Password Changed",
    user: "john.smith@example.com",
    ip: "192.168.1.1",
    location: "New York, USA",
    timestamp: "2023-05-14T16:45:00Z",
    details: "Password changed successfully",
    severity: "info",
  },
  {
    id: "4",
    event: "Account Locked",
    user: "sarah.johnson@example.com",
    ip: "198.51.100.72",
    location: "Chicago, USA",
    timestamp: "2023-05-14T10:15:00Z",
    details: "Account locked after 5 failed login attempts",
    severity: "error",
  },
  {
    id: "5",
    event: "Permission Changed",
    user: "admin@gmail.com",
    ip: "192.168.1.1",
    location: "New York, USA",
    timestamp: "2023-05-13T11:30:00Z",
    details: "Changed permissions for role: Transaction Admin",
    severity: "info",
  },
  {
    id: "6",
    event: "Suspicious Activity",
    user: "robert.wilson@example.com",
    ip: "172.16.254.1",
    location: "San Francisco, USA",
    timestamp: "2023-05-12T08:20:00Z",
    details: "Multiple rapid transaction approvals detected",
    severity: "warning",
  },
  {
    id: "7",
    event: "2FA Enabled",
    user: "michael.brown@example.com",
    ip: "198.51.100.72",
    location: "Chicago, USA",
    timestamp: "2023-05-11T15:10:00Z",
    details: "Two-factor authentication enabled via authenticator app",
    severity: "info",
  },
]

export function AdminSecurityLogs({ isLoading = false }: { isLoading?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLogs, setFilteredLogs] = useState(securityLogs)
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterLogs(term, severityFilter)
  }

  const handleSeverityFilter = (value: string) => {
    setSeverityFilter(value)
    filterLogs(searchTerm, value)
  }

  const filterLogs = (term: string, severity: string) => {
    let filtered = securityLogs

    if (term.trim() !== "") {
      filtered = filtered.filter(
        (log) =>
          log.event.toLowerCase().includes(term.toLowerCase()) ||
          log.user.toLowerCase().includes(term.toLowerCase()) ||
          log.details.toLowerCase().includes(term.toLowerCase()),
      )
    }

    if (severity !== "all") {
      filtered = filtered.filter((log) => log.severity === severity)
    }

    setFilteredLogs(filtered)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Shield className="mr-1 h-3 w-3" />
            {severity}
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Audit Logs</CardTitle>
        <CardDescription>Review security events and user activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={severityFilter} onValueChange={handleSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export logs</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP / Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    {log.ip}
                    <br />
                    <span className="text-xs text-muted-foreground">{log.location}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {securityLogs.length} logs
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
