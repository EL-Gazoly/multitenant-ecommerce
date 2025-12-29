"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "../../schema";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/cliient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const SignInView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => {
        toast.success("Logged in successfully");
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data);
  };
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-5">
      <div className=" bg-[#f4f4f4] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className=" flex items-center  justify-between mb-8">
              <Link href="/">
                <span
                  className={cn(poppins.className, " text-2xl font-semibold")}
                >
                  funroad
                </span>
              </Link>
              <Button
                asChild
                variant={"ghost"}
                size="sm"
                className="text-base border-none underline"
              >
                <Link href="/sign-up" prefetch>
                  Sign up
                </Link>
              </Button>
            </div>
            <h1 className=" text-4xl font-medium">Welcome back to funroad!</h1>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              variant={"elevated"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              disabled={login.isPending}
            >
              Sign in
            </Button>
          </form>
        </Form>
      </div>
      <div
        className=" h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default SignInView;
