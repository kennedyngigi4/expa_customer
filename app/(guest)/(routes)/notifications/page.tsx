"use client"

import { AllServices } from '@/lib/api_services';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

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
    <section className="flex flex-col min-h-screen w-full justify-start items-start">
      <div className="mx-auto pb-8">
        <h1 className="font-semibold py-6">Latest notifications</h1>
        <DataTable columns={columns} data={notifications} />
      </div>
    </section>
  )
}

export default NotificationsPage