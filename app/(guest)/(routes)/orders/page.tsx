"use client"

import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { useSession } from 'next-auth/react';
import { getAllOrders } from '@/lib/api_services';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import FAQS from '../_components/faqs';

const OrdersPage = () => {
  const { data:session, status } = useSession();
  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
      const loadOrders = async() => {
        if (!session?.accessToken) {
          throw new Error("Access token is missing.");
        }
        const data = await getAllOrders("logistics/client/my_orders/", session.accessToken);
        setOrders(data);
      }
      loadOrders();
    }, [session])

  return (
    <section className="py-10 flex flex-col md:px-30 px-12">
      <div className="flex flex-row justify-between items-center pb-6">
        <div>
          <h1 className="text-lg font-semibold text-amber-600">My Orders</h1>
          <p className="text-slate-400">Orders done through EXPA</p>
        </div>


        <div>
          <Link href="/create_order">
            <Button className="cursor-pointer">Send Parcel <Truck /></Button>
          </Link>
        </div>

      </div>
      <DataTable columns={columns} data={orders} />

      <div className="w-full pt-8">
        <h1 className="text-center font-bold text-orange-600 text-xl">Frequently Asked Questions</h1>
        <p className="text-center text-slate-500">Common Questions abour shipping delivery and courier services</p>

        <div className="pt-1 w-[90%] mx-auto">
          <FAQS />
        </div>

      </div>
    </section>
  )
}

export default OrdersPage