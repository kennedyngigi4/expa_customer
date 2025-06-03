"use client"

import { AllServices } from '@/lib/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const InvoicesPage = () => {
  const { data:session, status } = useSession();
  const [ invoices, setInvoices ] = useState([]);

  

  useEffect(() => {
    const loadInvoices = async() => {
      if (!session?.accessToken) {
        throw new Error("Access token is missing.");
      }
      
      const res = await AllServices.get("payments/invoices/", session.accessToken);
      setInvoices(res);
    }
    loadInvoices();
  }, [session])

  return (
    <section className="flex flex-col min-h-screen">
      <div className="pt-4 pb-3">
        <p className="text-slate-600 text-xl">My Invoices</p>
      </div>
      <div>
        <DataTable columns={columns} data={invoices} />
      </div>
    </section>
  )
}

export default InvoicesPage