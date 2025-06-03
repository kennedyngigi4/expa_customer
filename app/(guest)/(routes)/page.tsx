"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getAllOrders } from '@/lib/api_services';
import PaymentConfirmationModal from '@/components/modals/payment-confirmation-modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const DashboardPage = () => {
  const { data:session, status } = useSession();
  const [ orders, setOrders ] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadOrders = async() => {
      if (!session?.accessToken) {
        throw new Error("Access token is missing.");
      }
      const data = await getAllOrders("logistics/client/my_orders/", session.accessToken);
      setOrders(data);
    }
    loadOrders();
  }, [session]);


  const handleDelivery = async(value: string) => {
    sessionStorage.setItem("deliveryType", value);
    router.push("/create_order");
  }

  return (
    <section className="flex flex-col py-8">

      <div className="flex md:flex-row flex-col justify-between items-center">
        <div>
          <h1 className="font-bold text-xl">Welcome {session?.user?.name}!</h1>
          <p className="text-slate-500">What would you like EXPA to deliver on your behalf?</p>
        </div>
        <div>
          {/* <Link href="/create_order">
            <Button className="cursor-pointer">Send Parcel <Truck /></Button>
          </Link> */}
        </div>
      </div>

      <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4 pt-15">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("Intra City")}>
          <div>
            <Image src="/images/icons/bike.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Intra City Delivery</h1>
            <p>Send your parcel within your city. Same day deliveries in your town.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("Inter County")}>
          <div>
            <Image src="/images/icons/truck.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">Inter County Delivery</h1>
            <p>Send your parcel from one town to another. Deliveries can take 1 day or more.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 shadow p-4 rounded-lg cursor-pointer" onClick={() => handleDelivery("International")}>
          <div>
            <Image src="/images/icons/plane.png" alt="Intracity Delivery" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-orange-400">International Delivery</h1>
            <p>Send your parcel out of Kenya to another country.</p>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col pt-10">

        {orders?.length > 0 ? <>
          <h1 className="text-amber-500 text-lg font-semibold">Latest orders </h1>
          {orders.slice(0,5).map((order: any) => (
            <div className="grid md:grid-cols-5 grid-cols-2 py-2 gap-4 border-b-2 border-slate-100" key={order.id}>
              <div>
                <h1 className="text-slate-400">Order ID</h1>
                <Link href={`/orders/${order.id}`}><p className="text-slate-600">{order.order_id}</p></Link>
              </div>
              <div>
                <h1 className="text-slate-400 text-sm">Freight Type</h1>
                <p className="text-slate-600">{order.freight_type}</p>
              </div>
              <div>
                <h1 className="text-slate-400 text-sm">Recipient</h1>
                <p className="text-slate-600">{order.recipient_fullname}</p>
                <p className="text-slate-600">{order.recipient_phone}</p>
              </div>
              <div>
                <h1 className="text-slate-400 text-sm">Destination</h1>
                <p className="text-slate-600">{order?.recipient_location}</p>
              </div>
              <div>
                { order?.details?.transaction_id != null 
                  ? (<>
                      <h1 className="text-slate-400 text-sm">Status</h1>
                      <p className="text-green-600 text-sm">{order?.details?.delivery_status}</p>
                    </>
                    ) 
                  : (<>
                    
                    <p className="text-red-600"><PaymentConfirmationModal orderID={order?.id} detailsID={order?.details?.order_details_id} /></p>
                  </>)
                }
                
              </div>
              
            </div>
          ))}
        </> : (<>
          <div className="flex flex-col justify-center items-center h-[358px] border-dashed border-slate-200 border-4 rounded-2xl">
            <h1 className="text-2xl text-slate-300  font-bold">No orders</h1>  
          </div>
        </>)}
      </div>

    </section>
  )
}

export default DashboardPage