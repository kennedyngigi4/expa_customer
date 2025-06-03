"use server"

import { signIn, signOut } from "@/auth";


export async function userLogin(email: string, password: string): Promise<any>{
    try {
        const res = await signIn("credentials", { email: email, password: password, redirect: false  });
        if(res?.error){
            return { "success": false, "message": "Invalid Email or Password" }
        } else {
            return { "success": true, "message": "Log in successful" }
        }
    } catch(e){
        return { "success": false, "message": "Invalid Email or Password" }
    }
}




export async function userRegistration(userData: any): Promise<any>{
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/register/`, {
            method: "POST",
            body: userData
        })
        
        const data = await res.json()
        return data
        
        
    } catch(e){
        return { "success": false, "message": "Something went wrong." }
    }
}










