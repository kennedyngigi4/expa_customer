"use client"

import { AllServices } from '@/lib/api_services';
import { useSession,signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import FullnameForm from './_components/fullname';
import EmailForm from './_components/email_form';
import PhoneForm from './_components/phone_form';
import GenderForm from './_components/gender_form';
import { Camera, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { data:session, status } = useSession();
  const [ loading, setLoading ] = useState(false); 
  const [ profileData, setProfileData ] = useState({});

  useEffect(() => {
    const loadData = async() => {
      const data = await AllServices.get("account/profile/", session?.accessToken);
      setProfileData(data);
    }
    loadData();
  }, [session]);


  const handleLogout = async() => {
    await signOut();
  }

  return (
    <section className="flex flex-col min-h-screen">
      <div className="grid md:grid-cols-12 grid-cols-1 gap-3">
        <div className="md:col-span-3 content-start pt-5">
          <div className="w-[150px] h-[150px] rounded-full bg-slate-50 border-2 border-slate-100 relative">
            <div className="absolute bottom-4 right-0 shadow cursor-pointer bg-white p-2 rounded-full">
              <Camera />
            </div>
          </div>
        </div>
        <div className="md:col-span-9 content-end py-6">
          <div className="flex md:flex-row flex-col justify-between items-start space-y-3">
            <h1 className="font-semibold text-orange-500 pb-4 text-xl">Profile Settings</h1>
            <h1 className="text-green-600 flex border-2 border-slate-50 py-1 px-2 cursor-pointer rounded-lg">{profileData?.profiles?.account_type} <ChevronDown /></h1>
          </div>
          
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 pb-6">
            <div>
              <FullnameForm
                initialData={profileData.fullname}

              />
            </div>
            <div>
              <EmailForm
                initialData={profileData.email}

              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div>
              <PhoneForm
                initialData={profileData.phone}

              />
            </div>
            <div>
              <GenderForm
                initialData={profileData.gender}

              />
            </div>
          </div>

        </div>
      </div>

      <div className="content-end">
        <Button variant="destructive" size="sm" className="cursor-pointer" onClick={handleLogout}><LogOut />  Log Out</Button>
      </div>
      
    </section>
  )
}

export default ProfilePage