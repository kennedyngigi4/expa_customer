"use client"

import { AllServices } from '@/lib/api_services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import FAQS from '../_components/faqs';


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
    <section className="flex flex-col min-h-screen md:px-30 px-12">
      <div className="pt-4 pb-3">
        <p className="text-slate-600 text-xl">My Invoices</p>
      </div>
      <div>
        <DataTable columns={columns} data={invoices} />
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

export default InvoicesPage