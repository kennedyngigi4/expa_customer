"use client"

import { AllServices } from '@/lib/api_services';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import FAQS from '../_components/faqs';

const NotificationsPage = () => {
  const router = useRouter();
  const { data:session, status } = useSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async() => {
      if (!session?.accessToken) {
        throw new Error("Access token is missing.");
      }
      const resp = await AllServices.get("messaging/client/notifications", session.accessToken);
      setNotifications(resp);
      console.log(resp)
    }
    fetchNotifications();
  }, [session]);

  return (
    <section className="flex flex-col min-h-screen w-full justify-start items-start md:px-30 px-12">

      <div className="mx-auto pb-8 w-full">
        <h1 className="font-bold text-orange-600 text-xl pt-3">Latest notifications</h1>
        <DataTable columns={columns} data={notifications} />
      </div>

      <div className="w-full pt-8 max-lg:hidden">
        <h1 className="text-center font-bold text-orange-600 text-xl">Frequently Asked Questions</h1>
        <p className="text-center text-slate-500">Common Questions abour shipping delivery and courier services</p>

        <div className="pt-1 w-[90%] mx-auto">
          <FAQS />
        </div>

      </div>
    </section>
  )
}

export default NotificationsPage