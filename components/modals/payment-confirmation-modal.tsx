"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useSession } from 'next-auth/react';
import { AllServices } from '@/lib/api_services';
import { toast } from 'sonner';


interface PaymentConfirmationModalProps {
    detailsID: string
    orderID: string
}

const PaymentConfirmationModal = ({ detailsID, orderID }: PaymentConfirmationModalProps) => {
    const [ mpesacode, setMpesacode ] = useState("");
    const { data:session, status } = useSession();


    const handleCodeSubmit = async()=> {
        const formData = new FormData();
        formData.append("transaction_id", mpesacode);
        const res = await AllServices.patch(`logistics/client/update_order_details/${detailsID}/`, session?.accessToken, formData)
        
        if(res.success){
            toast.success(res.message, { position: "top-center"});
            location.reload();
        } else {
            toast.error(res.message, { position: "top-center" });
            location.reload();
        }

        
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 text-white cursor-pointer" size="sm">Confirm Payments</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Payments</DialogTitle>
                    <DialogDescription>Enter your MPESA CODE to confirm payments.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3">
                    <Label>MPESA CODE</Label>
                    <Input placeholder="e.g TDN6UEKLAQ" onChange={(e) => setMpesacode(e.target.value)} />

                    <div className="mt-3">
                        <Button className="cursor-pointer" onClick={handleCodeSubmit}>Submit</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentConfirmationModal