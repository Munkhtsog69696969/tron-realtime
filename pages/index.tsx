import Image from 'next/image'
import { Inter, Sen } from 'next/font/google'
import { useEffect, useState, useRef } from 'react'

import { ably } from '@/config/ablyConfig'
import Game from '@/components/Game'
import JoinGame from "@/components/JoinGame"


export default function Home() {
  const [playerData,setPlayerData]=useState(null);


  useEffect(()=>{
    setPlayerData(sessionStorage.getItem("player"));
  },[]);

  return(
    playerData ?
      <Game></Game>
    :
      <JoinGame></JoinGame>
  )
}
