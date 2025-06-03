"use client"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AllServices } from '@/lib/api_services';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface GenderFormProps{
    initialData: string,
}

const formSchema = z.object({
    gender: z.string().optional(),
})

const GenderForm = ({ initialData }: GenderFormProps) => {
    const { data:session } = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: initialData || "",
        }
    })

    const [ editing, setEditing ] = useState(false);
    
    const toggleEditing = async() => {
        setEditing((prev) => !prev);
    }

    useEffect(() => {
        form.reset({ gender: initialData });
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
            <h1>Gender</h1>
            <Button className="flex cursor-pointer" variant="ghost" onClick={toggleEditing}>
                <PencilIcon />
                Edit gender
            </Button>
        </div>
        {editing ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onformSubmit)}>
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="bg-white w-full">
                                            <SelectValue placeholder="Select your gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Male">Male</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                
                            </FormItem>
                        )}
                    />
                    <div className="pt-3">
                        <Button size="sm" className="cursor-pointer">Save</Button>
                    </div>
                </form>
            </Form>
        ) : (
            <p className="italic">
                {!initialData ? (
                    <>No selected gender</>
                ) : (
                    <>{initialData}</>
                )}
            </p>
        )}
        
    </section>
  )
}

export default GenderForm