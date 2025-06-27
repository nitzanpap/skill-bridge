"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { checkServerReadiness } from "@/lib/api"

export function ServerStatusChecker() {
  const { toast } = useToast()
  const [checkingServer, setCheckingServer] = useState(true)

  useEffect(() => {
    const checkServer = async () => {
      // Show initial toast
      const initialToastId = toast({
        title: "Waking up the server zZ",
        description: "This may take up to a minute on first startup...",
        duration: Infinity,
      }).id

      try {
        // Try to check the server readiness
        const isReady = await checkServerReadiness()

        // Update or dismiss the initial toast
        toast({
          title: isReady ? "Server ready!" : "Server issue",
          description: isReady
            ? "The server is up and running"
            : "The server responded but may not be fully ready",
          duration: isReady ? 3000 : 5000, // Auto-dismiss success message after 3 seconds
        })
      } catch (error) {
        // Server check failed entirely
        toast({
          title: "Server connection failed",
          description: "Could not connect to the server. Please try refreshing the page.",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setCheckingServer(false)
      }
    }

    checkServer()
  }, [toast])

  // This component doesn't render anything visible
  return null
}
