"use client"

import { useState } from "react"
import { Key, QrCode, Copy, RefreshCw, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export function AdminTwoFactorSettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [appAuthEnabled, setAppAuthEnabled] = useState(true)
  const [smsAuthEnabled, setSmsAuthEnabled] = useState(false)
  const [emailAuthEnabled, setEmailAuthEnabled] = useState(false)
  const [backupCodesGenerated, setBackupCodesGenerated] = useState(true)

  const handleCopySecret = () => {
    navigator.clipboard.writeText("JBSWY3DPEHPK3PXP")
    toast({
      title: "Secret copied",
      description: "The secret key has been copied to your clipboard.",
    })
  }

  const handleRegenerateBackupCodes = () => {
    toast({
      title: "Backup codes regenerated",
      description: "New backup codes have been generated. Please save them securely.",
    })
  }

  const handleDownloadBackupCodes = () => {
    toast({
      title: "Backup codes downloaded",
      description: "Your backup codes have been downloaded.",
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Secure your account with two-factor authentication.</CardDescription>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} aria-label="Toggle 2FA" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication adds an extra layer of security to your account by requiring more than just a
            password to sign in.
          </p>

          {twoFactorEnabled ? (
            <Tabs defaultValue="app">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="app">Authenticator App</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value="app" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-auth">Authenticator App</Label>
                    <div className="text-sm text-muted-foreground">
                      Use an authenticator app like Google Authenticator or Authy
                    </div>
                  </div>
                  <Switch id="app-auth" checked={appAuthEnabled} onCheckedChange={setAppAuthEnabled} />
                </div>

                {appAuthEnabled && (
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <div className="flex h-40 w-40 items-center justify-center rounded-md bg-muted">
                        <QrCode className="h-32 w-32 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Set up authenticator app</p>
                        <ol className="space-y-1 text-sm text-muted-foreground">
                          <li>1. Open your authenticator app</li>
                          <li>2. Scan the QR code or enter the key manually</li>
                          <li>3. Enter the 6-digit code from the app</li>
                        </ol>
                        <div className="flex items-center gap-2">
                          <Input value="JBSWY3DPEHPK3PXP" readOnly className="font-mono text-xs" />
                          <Button variant="outline" size="icon" onClick={handleCopySecret}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="verification-code"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button>Verify</Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-auth">SMS Authentication</Label>
                    <div className="text-sm text-muted-foreground">Receive verification codes via SMS</div>
                  </div>
                  <Switch id="sms-auth" checked={smsAuthEnabled} onCheckedChange={setSmsAuthEnabled} />
                </div>

                {smsAuthEnabled && (
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input id="phone-number" placeholder="+1 (555) 123-4567" className="flex-1" />
                        <Button>Send Code</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Standard message and data rates may apply.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sms-verification-code">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="sms-verification-code"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button>Verify</Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-auth">Email Authentication</Label>
                    <div className="text-sm text-muted-foreground">Receive verification codes via email</div>
                  </div>
                  <Switch id="email-auth" checked={emailAuthEnabled} onCheckedChange={setEmailAuthEnabled} />
                </div>

                {emailAuthEnabled && (
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-address">Email Address</Label>
                      <div className="flex gap-2">
                        <Input id="email-address" type="email" value="admin@gmail.com" readOnly className="flex-1" />
                        <Button>Send Code</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-verification-code">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email-verification-code"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button>Verify</Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <Key className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Two-Factor Authentication is disabled</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enable two-factor authentication to add an extra layer of security to your account.
              </p>
              <Button className="mt-4" onClick={() => setTwoFactorEnabled(true)}>
                Enable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {twoFactorEnabled && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Backup Codes</CardTitle>
            <CardDescription>Use these codes to access your account if you lose your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {backupCodesGenerated ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-10 items-center justify-center rounded-md border bg-muted font-mono text-sm"
                    >
                      {i === 0 ? "USED" : `${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Each code can only be used once. Store these somewhere safe but accessible.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadBackupCodes}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Codes
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopySecret}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Codes
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRegenerateBackupCodes}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Codes
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center">
                <Key className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No backup codes generated</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate backup codes to ensure you can access your account if you lose your device.
                </p>
                <Button className="mt-4" onClick={() => setBackupCodesGenerated(true)}>
                  Generate Backup Codes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
