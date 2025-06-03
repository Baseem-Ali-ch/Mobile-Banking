"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { uploadVerificationDocuments } from "@/store/slices/profileSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2, Upload, UserCheck, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED"
type DocumentType = "ID_PROOF" | "ADDRESS_PROOF" | "SELFIE"

interface VerificationDocument {
  id: string
  type: DocumentType
  status: VerificationStatus
  uploadedAt: string
  verifiedAt?: string
  rejectedReason?: string
  fileUrl?: string
}

export function IdentityVerification() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.profile)
  const [uploading, setUploading] = useState<DocumentType | null>(null)

  // Mock verification status
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("UNVERIFIED")

  // Mock documents
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: "1",
      type: "ID_PROOF",
      status: "UNVERIFIED",
      uploadedAt: "",
    },
    {
      id: "2",
      type: "ADDRESS_PROOF",
      status: "UNVERIFIED",
      uploadedAt: "",
    },
    {
      id: "3",
      type: "SELFIE",
      status: "UNVERIFIED",
      uploadedAt: "",
    },
  ])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploading(type)

      try {
        // Create a FormData object to handle file upload
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", type)

        await dispatch(uploadVerificationDocuments(formData)).unwrap()

        // Update document status
        setDocuments(
          documents.map((doc) =>
            doc.type === type
              ? {
                  ...doc,
                  status: "PENDING",
                  uploadedAt: new Date().toISOString(),
                  fileUrl: URL.createObjectURL(file),
                }
              : doc,
          ),
        )

        // If all documents are uploaded, update verification status
        const allUploaded = documents.every((doc) => (doc.type === type ? true : doc.status !== "UNVERIFIED"))
        if (allUploaded) {
          setVerificationStatus("PENDING")
        }

        toast({
          title: "Document uploaded",
          description: "Your document has been uploaded and is pending verification.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload document. Please try again.",
        })
      } finally {
        setUploading(null)
      }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not uploaded"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return (
          <div className="flex items-center text-green-600 dark:text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        )
      case "PENDING":
        return (
          <div className="flex items-center text-yellow-600 dark:text-yellow-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pending</span>
          </div>
        )
      case "REJECTED":
        return (
          <div className="flex items-center text-red-600 dark:text-red-500">
            <X className="h-4 w-4 mr-1" />
            <span>Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Unverified</span>
          </div>
        )
    }
  }

  // Get document type label
  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case "ID_PROOF":
        return "ID Proof"
      case "ADDRESS_PROOF":
        return "Address Proof"
      case "SELFIE":
        return "Selfie/Photo Verification"
    }
  }

  // Get document type description
  const getDocumentTypeDescription = (type: DocumentType) => {
    switch (type) {
      case "ID_PROOF":
        return "Upload a valid government-issued ID (passport, driver's license, or national ID card)."
      case "ADDRESS_PROOF":
        return "Upload a utility bill, bank statement, or official letter showing your name and address (issued within the last 3 months)."
      case "SELFIE":
        return "Upload a clear photo of yourself holding your ID and a handwritten note with today's date and 'For MoneyManager'."
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification Status</CardTitle>
          <CardDescription>Complete the verification process to unlock all features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">Verification Status:</span>
            </div>
            <div>{getStatusBadge(verificationStatus)}</div>
          </div>

          {verificationStatus === "UNVERIFIED" && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Complete the following steps to verify your identity:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Upload a valid government-issued ID</li>
                <li>Upload a proof of address</li>
                <li>Upload a selfie for photo verification</li>
              </ol>
            </div>
          )}

          {verificationStatus === "PENDING" && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Your verification is in progress</h3>
              <p className="text-sm">
                We are reviewing your documents. This process typically takes 1-3 business days. You will be notified
                once the verification is complete.
              </p>
            </div>
          )}

          {verificationStatus === "VERIFIED" && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Your identity has been verified</h3>
              <p className="text-sm">
                You have full access to all features of the platform. Thank you for completing the verification process.
              </p>
            </div>
          )}

          {verificationStatus === "REJECTED" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Your verification was rejected</h3>
              <p className="text-sm">
                Please review the feedback for each document and resubmit. If you have any questions, please contact our
                support team.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4 space-y-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{getDocumentTypeLabel(document.type)}</CardTitle>
                  {getStatusBadge(document.status)}
                </div>
                <CardDescription>{getDocumentTypeDescription(document.type)}</CardDescription>
              </CardHeader>
              <CardContent>
                {document.status === "UNVERIFIED" ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">No document uploaded yet</p>
                    <Label htmlFor={`upload-${document.type}`} className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                        <Upload className="h-4 w-4" />
                        <span>Upload Document</span>
                      </div>
                      <Input
                        id={`upload-${document.type}`}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, document.type)}
                        disabled={uploading !== null}
                      />
                    </Label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {document.fileUrl && (
                      <div className="flex justify-center">
                        <img
                          src={document.fileUrl || "/placeholder.svg"}
                          alt={getDocumentTypeLabel(document.type)}
                          className="max-h-48 object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Uploaded</p>
                        <p className="text-sm">{formatDate(document.uploadedAt)}</p>
                      </div>
                      {document.status === "VERIFIED" && document.verifiedAt && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Verified</p>
                          <p className="text-sm">{formatDate(document.verifiedAt)}</p>
                        </div>
                      )}
                    </div>
                    {document.status === "REJECTED" && document.rejectedReason && (
                      <div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 rounded-lg">
                        <p className="text-sm font-medium">Rejection Reason:</p>
                        <p className="text-sm">{document.rejectedReason}</p>
                      </div>
                    )}
                    {document.status !== "VERIFIED" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => document.fileUrl && window.open(document.fileUrl, "_blank")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    )}
                    {document.status === "REJECTED" && (
                      <Label htmlFor={`reupload-${document.type}`} className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md w-full">
                          <Upload className="h-4 w-4" />
                          <span>Upload New Document</span>
                        </div>
                        <Input
                          id={`reupload-${document.type}`}
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, document.type)}
                          disabled={uploading !== null}
                        />
                      </Label>
                    )}
                  </div>
                )}

                {uploading === document.type && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm font-medium">Uploading...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Timeline</CardTitle>
              <CardDescription>History of your verification process.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l">
                {/* Mock timeline events */}
                <div className="mb-8 relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())}
                    </p>
                    <p className="text-sm mt-1">
                      Your account was created. Verification is required to access all features.
                    </p>
                  </div>
                </div>

                {documents.some((doc) => doc.status !== "UNVERIFIED") && (
                  <div className="mb-8 relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Documents Uploaded</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())}
                      </p>
                      <p className="text-sm mt-1">You uploaded verification documents. Our team is reviewing them.</p>
                    </div>
                  </div>
                )}

                {verificationStatus === "VERIFIED" && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Verification Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString())}
                      </p>
                      <p className="text-sm mt-1">
                        Your identity has been verified. You now have full access to all features.
                      </p>
                    </div>
                  </div>
                )}

                {verificationStatus === "REJECTED" && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-500"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Verification Rejected</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString())}
                      </p>
                      <p className="text-sm mt-1">
                        Your verification was rejected. Please review the feedback and resubmit your documents.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
