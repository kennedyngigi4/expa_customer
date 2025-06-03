"use client"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AllServices } from '@/lib/api_services';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface PhoneFormProps{
    initialData: string,
}

const formSchema = z.object({
    phone: z.string({"required_error": "Phone is required"}),
})

const PhoneForm = ({ initialData }: PhoneFormProps) => {
    const { data:session } = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: initialData || "",
        }
    })

    const [ editing, setEditing ] = useState(false);
    
    const toggleEditing = async() => {
        setEditing((prev) => !prev);
    }

    useEffect(() => {
        form.reset({ phone: initialData });
    }, [initialData]);

    const onformSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const res = await AllServices.put("account/profile/", session?.accessToken, values);
            if (res.success) {
                toast.success(res.message, { position: "top-center" });
            } else {
                toast.error(res.message, { position: "top-center" });
            }
        } catch (e) {
            toast.error("Something went wrong", { position: "top-center" })
        }
    }

  return (
    <section className="bg-slate-50 border-2 text-sm border-slate-100 rounded-lg p-6">
        <div className="flex md:flex-row flex-col justify-between items-center pb-5">
            <h1>Phone</h1>
            <Button className="flex cursor-pointer" variant="ghost" onClick={toggleEditing}>
                <PencilIcon />
                Edit phone
            </Button>
        </div>
        {editing ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onformSubmit)}>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        placeholder='Phone'
                                        type="text"
                                        className="bg-white"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="pt-3">
                        <Button size="sm" className="cursor-pointer">Save</Button>
                    </div>
                </form>
            </Form>
        ) : (
            <p className="italic">{initialData}</p>
        )}
        
    </section>
  )
}

export default PhoneForm