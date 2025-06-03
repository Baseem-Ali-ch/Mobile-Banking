"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pagination } from "@/components/ui/pagination"
import { Search, Filter, MoreHorizontal, Eye, RotateCcw, Download, AlertCircle } from "lucide-react"
import { fetchAuditLogs, revertChange, type AuditLogEntry } from "@/store/slices/settingsSlice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AuditTrailSettings() {
  const dispatch = useAppDispatch()
  const auditLogs = useAppSelector((state) => state.settings.auditLogs.items)
  const pagination = useAppSelector((state) => state.settings.auditLogs.pagination)
  const loading = useAppSelector((state) => state.settings.auditLogs.loading)

  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isRevertDialogOpen, setIsRevertDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [filters, setFilters] = useState({
    entityType: "",
    action: "",
    startDate: "",
    endDate: "",
    userId: "",
  })

  useEffect(() => {
    loadAuditLogs()
  }, [dispatch, pagination.page, pagination.limit])

  const loadAuditLogs = () => {
    dispatch(
      fetchAuditLogs({
        page: pagination.page,
        limit: pagination.limit,
        filters: {
          ...filters,
          search: searchQuery,
        },
      }),
    )
  }

  const handleSearch = () => {
    loadAuditLogs()
  }

  const handlePageChange = (page: number) => {
    dispatch(
      fetchAuditLogs({
        page,
        limit: pagination.limit,
        filters: {
          ...filters,
          search: searchQuery,
        },
      }),
    )
  }

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log)
    setIsDetailsDialogOpen(true)
  }

  const handleRevertChange = (log: AuditLogEntry) => {
    setSelectedLog(log)
    setIsRevertDialogOpen(true)
  }

  const confirmRevert = async () => {
    if (selectedLog) {
      await dispatch(revertChange(selectedLog.id))
      setIsRevertDialogOpen(false)
      loadAuditLogs()
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    setIsFilterDialogOpen(false)
    loadAuditLogs()
  }

  const resetFilters = () => {
    setFilters({
      entityType: "",
      action: "",
      startDate: "",
      endDate: "",
      userId: "",
    })
    setSearchQuery("")
  }

  const exportAuditLogs = () => {
    // Implementation for exporting audit logs
    console.log("Exporting audit logs")
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  const formatChanges = (changes: Record<string, { before: any; after: any }>) => {
    return Object.entries(changes).map(([key, { before, after }]) => (
      <div key={key} className="mb-2">
        <div className="font-medium">{key}</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Before: </span>
            {typeof before === "object" ? JSON.stringify(before) : String(before)}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">After: </span>
            {typeof after === "object" ? JSON.stringify(after) : String(after)}
          </div>
        </div>
      </div>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Track all configuration changes with complete history</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search audit logs..."
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" onClick={exportAuditLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="h-16 text-center">
                        <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : auditLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.entityType.charAt(0).toUpperCase() + log.entityType.slice(1)} ({log.entityId.slice(0, 8)})
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.performedBy.name}</div>
                      <div className="text-xs text-muted-foreground">{log.performedBy.role}</div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(log)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {log.action !== "view" && (
                            <DropdownMenuItem onClick={() => handleRevertChange(log)}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Revert Change
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <Pagination>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 mx-2">
              {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next
            </Button>
          </Pagination>
        </div>
      </CardContent>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Audit Logs</DialogTitle>
            <DialogDescription>Refine audit logs by specific criteria</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="entityType" className="text-sm font-medium">
                Entity Type
              </label>
              <Select value={filters.entityType} onValueChange={(value) => handleFilterChange("entityType", value)}>
                <SelectTrigger id="entityType">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="action" className="text-sm font-medium">
                Action
              </label>
              <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="userId" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="userId"
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                placeholder="Filter by user ID"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              {selectedLog && (
                <>
                  {selectedLog.action.charAt(0).toUpperCase() + selectedLog.action.slice(1)} operation on{" "}
                  {selectedLog.entityType}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Entity Type</div>
                    <div>{selectedLog.entityType}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Entity ID</div>
                    <div>{selectedLog.entityId}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Action</div>
                    <div>
                      <Badge variant="outline" className={getActionColor(selectedLog.action)}>
                        {selectedLog.action.charAt(0).toUpperCase() + selectedLog.action.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                    <div>{new Date(selectedLog.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Performed By</div>
                    <div>{selectedLog.performedBy.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedLog.performedBy.role}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">IP Address</div>
                    <div>{selectedLog.ipAddress}</div>
                    <div className="text-sm text-muted-foreground">{selectedLog.userAgent}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Changes</div>
                  <div className="rounded-md border p-3">{formatChanges(selectedLog.changes)}</div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            {selectedLog && selectedLog.action !== "view" && (
              <Button variant="outline" onClick={() => handleRevertChange(selectedLog)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Revert Change
              </Button>
            )}
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revert Confirmation Dialog */}
      <Dialog open={isRevertDialogOpen} onOpenChange={setIsRevertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Revert</DialogTitle>
            <DialogDescription>
              Are you sure you want to revert this change? This will undo the changes made and create a new audit log
              entry.
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are about to revert a {selectedLog.action} operation on {selectedLog.entityType} made by{" "}
                {selectedLog.performedBy.name} on {new Date(selectedLog.timestamp).toLocaleDateString()}.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevertDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRevert}>
              Revert Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
