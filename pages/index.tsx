import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

import { io } from 'socket.io-client'

let socket:any;

export default function Home() {
  const [input,setInput]=useState("")

  useEffect(()=>{
    socketInitilizer()
  },[])

  async function socketInitilizer(){
    await fetch("/api/socket")

    socket=io();

    socket.on("receive-messages",(data:any)=>{
      console.log(data)
    })
  }

  function Send(){
    socket.emit("send-messages" ,{
      input
    });
  }

  return (
    <div>
      <div>Chat</div>
      <input
        value={input}
        onChange={(e)=>{setInput(e.target.value)}}
        placeholder='Send messages......'
      />
      <button
        onClick={Send}
      >Send
      </button>
    </div>
  )
}
