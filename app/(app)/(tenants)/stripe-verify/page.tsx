"use client"
import { useEffect } from "react"
import { useTRPC } from "@/trpc/cliient"
import { useMutation  } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
export default function StripeVerifyPage() {
    const router = useRouter()
    const trpc = useTRPC()
    const {mutate: verifyStripeAccount} = useMutation(trpc.checkout.verify.mutationOptions({
        onSuccess: (data) => {
            if(data.url) {
                router.push(data.url)
            }
        },
        onError: () => {
            router.push("/")
        }
    }))
    useEffect(() => {
        verifyStripeAccount()
    }, [verifyStripeAccount])
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
     <Loader2Icon className="animate-spin text-muted-foreground " /> 
    </div>
  )
}