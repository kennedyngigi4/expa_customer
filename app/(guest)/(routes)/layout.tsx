"use client"

import { SessionProvider } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { redirect, useRouter } from 'next/navigation'
import Loader from '@/components/modals/loader'

const GuestLayout = ({ children } : Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ isReady, setIsReady ] = useState(false);

  useEffect(() => {
    if(status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else {
      setIsReady(true);
    }
  }, [router, status]);


  if(!isReady) {
    return <Loader />
  }

  return (
    <section>
      <Navbar />
        <div className="md:px-30 px-12 min-h-screen">
          {children}
        </div>  
      <Footer />
    </section>
  )
}

export default GuestLayout