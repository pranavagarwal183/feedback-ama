'use client'
import { UseSession, signIn, signOut, useSession } from 'next-auth/react'

export default function Component(){
    const {data: session}=useSession()
    if (session){
        return (
            <>
            Signed in as {session.user.email}<br/>
            <button onClick={()=>signOut()}>Sign Out</button>
            </>
        )
    }
    return(
        <>
        Not Signed in<br/>
        <button className="bg-orange-500 px-3 py-2 " onClick={()=>signIn()}>Sign Out</button>
        </>
    )
}