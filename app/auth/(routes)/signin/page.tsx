"use client"

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'
import { userLogin } from '@/lib/server_services'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string({ "required_error": "Email is required" }).email({ "message": "Invalid email address" }),
  password: z.string({ "required_error": "Password is required" })
            .min(8, { "message": "Password must be at least 8 characters"})
})

const SigninPage = () => {
  const router = useRouter();
  const [ passwordType, setPasswordType ] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const handleLogin = async(values: z.infer<typeof formSchema>) => {
    const res = await userLogin(values.email, values.password);
    if(res.success){
      toast.success(res.message, { position: "top-center" });
      window.location.href = "/";
      // router.push("/");
    } else {
      toast.error(res.message, { position: "top-center" });
    }
  }


  return (
    <section className="flex flex-col bg-white md:w-1/3 rounded-lg p-4">
      <div className="pb-7">
        <h1 className="text-amber-600 text-xl font-semibold">Login</h1>
        <p className="text-sm">Welcome back to <span className="text-amber-600">EXPA</span></p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
          <FormField 
            name="email"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="e.g johndoe@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            name="password"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={passwordType ? "text" : "password"}
                      placeholder="********"
                      {...field}
                    />

                    <div className="absolute z-50 right-3 top-3" onClick={() => setPasswordType((prev) => !prev)}>
                      {passwordType ? <><Eye className="w-4 h-4 text-slate-500" /></> : <><EyeClosed className="w-4 h-4  text-slate-500" /></>}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full cursor-pointer" disabled={ !isValid || isSubmitting} variant="default">Log in</Button>
          </div>
        </form>
      </Form>
      <p className="pt-6 pb-2 text-sm">Not having account? <Link className="text-amber-600 cursor-pointer" href="/auth/signup">Register</Link></p>
    </section>
  )
}

export default SigninPage