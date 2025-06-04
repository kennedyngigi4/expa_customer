"use client"

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SelectValue } from '@radix-ui/react-select';
import { CreateOrder } from '@/lib/api_services';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LocationSearch from './_components/location-search';

const formSchema = z.object({
  delivery_type: z.string({ "required_error": "Delivery type is required" }),
  freight_type: z.string({ "required_error": "Freight type is required"}),
  fragile: z.string({ "required_error": "Is item fragile?" }),
  urgency: z.string().optional(),
  height: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  weight: z.string().optional(),
  sender_fullname: z.string({ required_error: "Name is required" }),
  sender_email: z.string({ required_error: "Email is required" }),
  sender_phone: z.string({ required_error: "Phone number is required" }),
  pickup_datetime: z.string({ required_error: "Pickup date and time required" }),
  pickup_location: z.string({ required_error: "Pickup location required" }),
  pickup_latLng: z.string().optional(),
  package_name: z.string({ "required_error": "Package name is required"}),
  description: z.string().optional(),
  recipient_fullname: z.string({ required_error: "Name is required" }),
  recipient_email: z.string({ required_error: "Email is required" }),
  recipient_phone: z.string({ required_error: "Phone number is required" }),
  recipient_location: z.string({ required_error: "Pickup location required" }),
  recipient_latLng: z.string().optional(),
});


const deliveryOptions = [ "Intra City", "Inter County", "International"];

const CreateOrderPage = () => {
  const { data:session, status } = useSession();
  const [ activeTab, setActiveTab ] = useState("details");
  const [ images, setImages ] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls ] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<z.infer <typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery_type: "",
      freight_type: "",
      fragile: "",
      urgency: "",
      height: "",
      length: "",
      width: "",
      weight: "",
      sender_fullname: "",
      sender_email: "",
      sender_phone: "",
      pickup_datetime: "",
      pickup_location: "",
      pickup_latLng: "",
      package_name: "",
      description: "",
      recipient_fullname: "",
      recipient_email: "",
      recipient_phone: "",
      recipient_location: "",
      recipient_latLng: "",
    }
  })
  const { setValue } = form;
  const { isValid, isSubmitting } = form.formState;
  const formValues = form.watch();

  const nextToRecipient = async() => {
    setActiveTab("recipient");
  }

  const nextToPayments = async () => {
    setActiveTab("payments");
  }

  

  const handleImagesUpload = async (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files);
    
    
    const uniqueFiles = selectedFiles.filter((file) => !images.some((img) => img.name === file.name));
    setImages((prev) => [...prev, ...uniqueFiles]);

    // preview images
    const previewImages = uniqueFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previewImages]);
  }


  const handleRemoveImage = async(index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  }


  const handleUpload = async(values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("delivery_type", values.delivery_type);
    formData.append("freight_type", values.freight_type);
    formData.append("fragile", values.fragile);
    
    formData.append("sender_fullname", values.sender_fullname);
    formData.append("sender_email", values.sender_email);
    formData.append("sender_phone", values.sender_phone);
    formData.append("pickup_datetime", values.pickup_datetime);
    formData.append("pickup_location", values.pickup_location);
    formData.append("recipient_fullname", values.recipient_fullname);
    formData.append("recipient_email", values.recipient_email);
    formData.append("recipient_phone", values.recipient_phone);
    formData.append("recipient_location", values.recipient_location);
    formData.append("package_name", values.package_name);
    

    images.forEach((image) => {
      formData.append("images", image);
    })
    

    
    if (values.urgency){
      formData.append("urgency", values.urgency);
    }

    if (values.height) {
      formData.append("height", values.height);
    }

    if (values.length) {
      formData.append("length", values.length);
      
    }

    if (values.width) {
      formData.append("width", values.width);
    }

    if (values.weight) {
      formData.append("weight", values.weight);
    }

    if (values.description) {
      formData.append("description", values.description);
    }

    if (values.pickup_latLng){
      formData.append("recipient_latLng", values.pickup_latLng);
    }

    if (values.recipient_latLng) {
      formData.append("recipient_latLng", values.recipient_latLng);
    }

    if (!values.length || !values.width || !values.height) {
      toast.error("Length, width, and height must be provided", { position: "top-center" });
      throw new Error("Length, width, and height must be provided");
    }
    // const amount = parseInt((parseFloat(values.length) * parseFloat(values.width) * parseFloat(values.height)) *20000) 
    const amount = Math.round(
      parseFloat(values.length) *
      parseFloat(values.width) *
      parseFloat(values.height) *
      20000
    );
    formData.append("price", String(amount));
    
    
    if (!session?.accessToken) {
      throw new Error("Access token is missing.");
    }


    const res = await CreateOrder("logistics/client/create_order/", session.accessToken, formData);
    console.log(res)
    if(res.success){
      toast.success(res.message, { position: "top-center" });
      router.push(`/orders/${res.id}`);
    } else {
      toast.error("Something went wrong", { position: "top-center"});
    }
   
  }


  useEffect(() => {
    const stored = sessionStorage.getItem("deliveryType");
    
    if(stored){
      form.setValue("delivery_type", stored);
      sessionStorage.removeItem("deliveryType");
    }
  },[form]);


  return (
    <section className="py-8 md:px-30 px-12">
      
      <div>
        <Link href="/orders">
          <Button className="text-sm cursor-pointer text-slate-500" variant="ghost"><ArrowLeft /> Back to orders</Button>
        </Link>
      </div>


      <div>
        <div className="flex flex-col py-7">
          <h1 className="font-bold text-xl text-amber-600">Place Delivery Order</h1>
          <p className="text-slate-500">Ensure you fill out all required fields</p>
        </div>

        

        <Tabs value={activeTab}>
          <TabsList className="w-full">
            <TabsTrigger value="details">Parcel Details</TabsTrigger>
            <TabsTrigger value="recipient">Recipient Details</TabsTrigger>
            <TabsTrigger value="payments">Preview & Pay</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-6">
              <TabsContent value='details'>
                <div className="py-6 flex flex-col">
                  <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                    <div className="w-40 h-40 border-4 border-slate-300 border-dashed bg-gray-100">
                      <div className="flex flex-col justify-centre p-5 items-center" onClick={() => document.getElementById("fileInput")?.click()}>
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                        <p className="text-center text-slate-400">Click to upload images</p>
                        <Input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          id="fileInput" 
                          onChange={(e) => handleImagesUpload(e.target.files)}
                        />
                      </div>
                    </div>
                    {previewUrls.map((src, index) => (
                      <div key={index} className="ml-3 mb-3 relative">
                        <img src={src} alt="Preview" className="md:w-50 md:h-40 w-60 h-60 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  

                  <div className="grid md:grid-cols-4 grid-cols-1 pt-8 gap-5">
                    <FormField 
                      name="delivery_type"
                      control={form.control}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Delivery Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={(val) => {
                              field.onChange(val);   // ✅ update form state
                            }} value={field.value || ""}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select delivery type" />
                              </SelectTrigger>
                              <SelectContent>
                                {deliveryOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option} Delivery</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="freight_type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select freight type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Documents">Documents</SelectItem>
                                <SelectItem value="Fine Art">Fine Art</SelectItem>
                                <SelectItem value="Medical">Medical</SelectItem>
                                <SelectItem value="Package">Package</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      name="fragile"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fragile?</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Is item fragile?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="True">Yes</SelectItem>
                                <SelectItem value="False">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="urgency"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Urgency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Fair">Fair</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-4 grid-cols-1 gap-5 pt-4">
                      <FormField 
                        name="length"
                        control={form.control}
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Length in metres</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="e.g. 0.8"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="width"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width in metres</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 0.5"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="height"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height in metres</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 0.3"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="weight"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight in Kgs</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 0.3"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                  </div>


                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 pt-4">
                    <FormField
                      name="sender_fullname"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. John Doe"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="sender_email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. johndoe@email.com"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="sender_phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. 0722 620 988"
                              {...field}
                              value={field.value ?? "254"}
                              onChange={(e) => {
                                let input = e.target.value;

                                if(!input.startsWith("254")){
                                  input = "254"
                                }
                                input = input.replace(/[^0-9]/g, "")

                                field.onChange(input);
                              }}
                              maxLength={12}
                              inputMode="numeric"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 pt-4">
                    <FormField
                      name="pickup_datetime"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup DateTime</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="pickup_location"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup location</FormLabel>
                          <FormControl>
                            <LocationSearch value={field.value} onChange={field.onChange} onLatLngChange={(lat, lng) => { setValue("pickup_latLng", `${lat.toString()},${lng.toString()}`) }  }  />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="package_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Name</FormLabel>
                          <FormControl>
                            <Input 
                              type="text"
                              placeholder="e.g 'Medicine' or 'Apparel package' or 'TV Set' "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="py-5 w-full">
                    <FormField
                      name="description"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter extra information here ...." {...field}></Textarea>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Button type="button" onClick={nextToRecipient} className="cursor-pointer">Next</Button>
                  </div>
                  
                </div>
              </TabsContent>
              <TabsContent value='recipient'>
                <div className="py-6">
                  <h1 className="font-semibold">Recipient Details</h1>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 pt-4">
                    <FormField
                      name="recipient_fullname"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. John Doe"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="recipient_email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. johndoe@email.com"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="recipient_phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. 0722 620 988"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 pt-4">
                    <FormField
                      name="recipient_location"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient location (Destination)</FormLabel>
                          <FormControl>
                            <LocationSearch value={field.value} onChange={field.onChange} onLatLngChange={(lat, lng) => { setValue("recipient_latLng", `${lat.toString()},${lng.toString()}`) }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="py-6 space-x-10">
                    <Button type="button" onClick={() => setActiveTab("details")} variant="ghost" className="cursor-pointer"><ArrowLeft /> Back</Button>
                    <Button type="button" onClick={nextToPayments} className="cursor-pointer">Next</Button>
                  </div>
                  
                </div>
              </TabsContent>
              <TabsContent value='payments'>
                <div className="py-6">
                  <h1 className="text-lg font-semibold text-amber-600">Preview and make payments</h1>

                  <div className="grid md:grid-cols-4 grid-cols-2 gap-4 pt-5">
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Delivery type</h1>
                      <p>{formValues.delivery_type || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Freight type</h1>
                      <p>{formValues.freight_type || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Fragile</h1>
                      <p>{formValues.fragile || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Urgency</h1>
                      <p>{formValues.urgency || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 grid-cols-2 gap-4 pt-5">
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Length in metres</h1>
                      <p>{formValues.length || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Width in metres</h1>
                      <p>{formValues.width || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Height in metres</h1>
                      <p>{formValues.height || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Weight in Kgs</h1>
                      <p>{formValues.weight || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-4 pt-5">
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Sender</h1>
                      <p>{formValues.sender_fullname || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Sender Email</h1>
                      <p>{formValues.sender_email || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Sender Phone</h1>
                      <p>{formValues.sender_phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 grid-cols-2 gap-4 pt-5">
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Pickup location</h1>
                      <p>{formValues.pickup_location || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Pickup date and time</h1>
                      <p>{new Date(formValues.pickup_datetime).toLocaleDateString() || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Recipient</h1>
                      <p>{formValues.recipient_fullname || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Recipient phone</h1>
                      <p>{formValues.recipient_phone || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Recipient email</h1>
                      <p>{formValues.recipient_email || "Not provided"}</p>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className="text-slate-500">Recipient location</h1>
                      <p>{formValues.recipient_location || "Not provided"}</p>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='flex flex-col pt-5'>
                      <h1 className="text-slate-500">More details</h1>
                      <p>{formValues.description || "Not provided"}</p>
                    </div>
                  </div>
                    
                  <div className='w-full pt-8'>
                    <h1 className="text-amber-500 font-bold">Payments</h1>
                    <div className='grid md:grid-cols-2 pt-3'>
                      <div>
                        <h1 className="text-slate-500">MPESA Number</h1>
                        <p>{formValues.sender_phone || "Not provided"}</p>
                      </div>
                      <div>
                        <h1 className="text-slate-500">Amount to Pay</h1>
                        <p>KSh. {Math.round((parseFloat(formValues?.height ?? "0") * parseFloat(formValues?.width ?? "0") * parseFloat(formValues?.length ?? "0")) * 20000).toLocaleString() || 0 }</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 space-x-10">
                    <Button type="button" onClick={() => setActiveTab("recipient")} variant="ghost" className="cursor-pointer"><ArrowLeft /> Back</Button>
                    <Button type="submit" className="cursor-pointer">Submit</Button>
                  </div>
                </div>
              </TabsContent>

            </form>
          </Form>
          
        </Tabs>
      </div>
      
    </section>
  )
}

export default CreateOrderPage