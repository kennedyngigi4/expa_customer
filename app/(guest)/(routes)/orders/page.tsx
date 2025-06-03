"use client"

import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { useSession } from 'next-auth/react';
import { getAllOrders } from '@/lib/api_services';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

const OrdersPage = () => {
  const { data:session, status } = useSession();
  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
      const loadOrders = async() => {
        const data = await getAllOrders("logistics/client/my_orders/", session?.accessToken);
        setOrders(data);
      }
      loadOrders();
    }, [session])

  return (
    <section className="py-10 flex flex-col">
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
    </section>
  )
}

export default OrdersPage