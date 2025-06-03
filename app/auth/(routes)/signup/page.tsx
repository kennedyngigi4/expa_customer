"use client"

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, EyeClosed } from 'lucide-react';
import { userRegistration } from '@/lib/server_services';


const formSchema = z.object({
  fullname: z.string({ "required_error": "Name is required" }),
  email: z.string({ "required_error": "Email is required" }).email({ "message": "Invalid email address" }),
  phone: z.string({ "required_error": "Phone number is required" }),
  password: z.string({ "required_error": "Password is required" })
    .min(8, { "message": "Password must be at least 8 characters" })
})


const SignupPage = () => {

  const [ passwordType, setPasswordType ] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      password: "",
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const handleRegistration = async(values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append("fullname", values.fullname);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("role", "Client");

    const res = await userRegistration(formData);
    if(res?.success){
      toast.success(res.message, { position: "top-center" });
    } else {
      toast.error(res.message, { position: "top-center" });
    }
  }


  return (
    <section className="flex flex-col bg-white md:w-1/3 rounded-lg p-4">
      <div className="pb-7">
        <h1 className="text-amber-600 text-xl font-semibold">Register</h1>
        <p className="text-sm">Send cargo and parcels with <span className="text-amber-600">EXPA</span></p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-6">
          <FormField
            name="fullname"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
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
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="e.g 0722 620 988"
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
            render={({ field }) => (
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
                      {passwordType ? <><EyeClosed className="w-4 h-4 text-slate-500" /></> : <><Eye className="w-4 h-4  text-slate-500" /></>}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full cursor-pointer" disabled={!isValid || isSubmitting} variant="default">Register</Button>
          </div>
        </form>
      </Form>
      <p className="pt-6 pb-2 text-sm">Already having account? <Link className="text-amber-600 cursor-pointer" href="/auth/signin">Log in</Link></p>
    </section>
  )
}

export default SignupPage