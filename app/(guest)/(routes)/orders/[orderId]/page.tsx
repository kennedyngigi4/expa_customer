"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { MapPin, MapPinCheckIcon, Trash2 } from 'lucide-react';
import PaymentConfirmationModal from '@/components/modals/payment-confirmation-modal';

const OrderPage = () => {
  const params = useParams();
  const { data:session, status } = useSession()
  const [ order, setOrder ] = useState({});
  const [ formattedDate, setformattedDate ] = useState("");
  const [ loaded, setLoaded] = useState(false);


  useEffect(() => {
    const loadOrderData = async() => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/logistics/client/order_details/${params?.orderId}/`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${session?.accessToken}`
        }
      });
      const data = await res.json();
      console.log(data)
      setOrder(data);
    }
    loadOrderData();
  }, [session, params?.orderId]);


  useEffect(() => {
    if(order?.order_id){
      const date = new Date(order?.created_at);
      const fDate = format(date, "PPP p");

      setformattedDate(fDate)
    }
  }, [order?.order_id]);


  const handleOrderDelete = async() => {

  }

  return (
    <section className="p-6">
      <div className="">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-10">
          <div>
            <h1 className="font-bold text-xl text-amber-600">{order?.order_id}</h1>
            <p className="text-sm">{formattedDate}</p>
          </div>
          <div className="pt-4">
            <h1 className="font-semibold">Status</h1>
            <p className="text-green-600">{order?.details?.delivery_status}</p>
            <div className="pt-4">
              <Button variant="link" onClick={handleOrderDelete} className="mx-auto text-red-600 cursor-pointer hover:no-underline">
                <Trash2 /> Cancel Order
              </Button>
            </div>
          </div>
          <div className="pt-4">
            { order?.details?.transaction_id != null
              ? ( <div>
                    <h1 className="text-green-600 font-bold">{order?.details?.transaction_id}</h1>
                    <p className="font-semibold pt-3">{order?.details?.delivery_stage}</p>
                    <p className="text-amber-400 font-semibold">{order?.details?.delivery_status}</p>
                  </div>
                ) 
              : (
                <div className="flex flex-col items-start space-y-5">
                  <div>
                    <h1 className="text-slate-500 font-semibold">Charges</h1>
                    <h1>KShs. {parseInt(order?.price).toLocaleString()}</h1>
                  </div>

                  <PaymentConfirmationModal detailsID={order?.details?.order_details_id} orderID={order?.id} />

                  
                </div>
              )
            }
            
          </div>
        </div>  
      </div>

      <div className="pt-10">
        <h1 className="text-lg text-amber-600 font-bold">More details</h1>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-10">
          <div>
            <h1 className="text-slate-400 text-sm">Package Name</h1>
            <p className="text-slate-600">{order?.package_name}</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Delivery Type</h1>
            <p className="text-slate-600">{order?.delivery_type!}</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Freight Type</h1>
            <p className="text-slate-600">{order?.freight_type}</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Fragile</h1>
            <p className="text-slate-600">{order?.fragile}</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Urgency</h1>
            <p className="text-slate-600">{order?.urgency}</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Length</h1>
            <p className="text-slate-600">{order?.length}m</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Width</h1>
            <p className="text-slate-600">{order?.width}m</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Height</h1>
            <p className="text-slate-600">{order?.height}m</p>
          </div>
          <div>
            <h1 className="text-slate-400 text-sm">Weight</h1>
            <p className="text-slate-600">{order?.weight}kgs</p>
          </div>
        </div>
      </div>


      <div className="pt-14">
        <h1 className="text-lg text-amber-600 font-bold">Delivery Details</h1>

        <div className="flex lg:flex-row flex-col justify-start pt-4 space-x-40 max-lg:space-y-6">

          <div className="flex  space-x-6">
            <MapPin className="text-green-700" />
            <div>
              <h1 className="text-slate-400 font-semibold text-sm">From</h1>
              <p className="text-slate-600">{order?.sender_fullname!}</p>
              <p className="text-slate-600">{order?.sender_phone!}</p>
              <p className="text-slate-600">{order?.pickup_location!}</p>
            </div>
          </div>

          <div className="flex space-x-6">
            <MapPin className="text-red-700"/>
            <div>
              <h1 className="text-slate-400 font-semibold text-sm">To</h1>
              <p className="text-slate-600">{order?.recipient_fullname!}</p>
              <p className="text-slate-600">{order?.recipient_phone!}</p>
              <p className="text-slate-600">{order?.recipient_location!}</p>
            </div>
          </div>

        </div>
      </div>


    </section>
  )
}

export default OrderPage