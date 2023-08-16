import Image from 'next/image'
import { Inter, Sen } from 'next/font/google'
import { useEffect, useState, useRef } from 'react'
import { ably } from '@/config/ablyConfig'
import useInterval from 'use-interval'

export default function Home() {
  const channel = ably.channels.get('quickstart');
  //map
  const [mapSize,setMapSize]=useState(0);
  const mapRef:any = useRef(null);
  const scale:number=10;
  const [index,setIndex]=useState<number>(20);
  //player
  const [playerCoordinate,setPlayerCoordinate]=useState({left:0 , top:0});
  const [playerDirection,setPlayerDirection]=useState("right");
  const [playerBodyCoords,setPlayerBodyCoords]=useState<object[]>([]);

  useEffect(()=>{
    if(mapRef){
      setMapSize(mapRef.current.offsetWidth);
    }
    if(mapSize){
      setIndex(mapSize&&mapSize/scale);
    }

    window.addEventListener("keydown" , (event)=>{
      setPlayerDirection((prevDirection) => {
        switch (event.code) {
          case "KeyD":
            if (prevDirection !== "left") {
              return "right";
            }
            break;
          case "KeyA":
            if (prevDirection !== "right") {
              return "left";
            }
            break;
          case "KeyW":
            if (prevDirection !== "down") {
              return "up";
            }
            break;
          case "KeyS":
            if (prevDirection !== "up") {
              return "down";
            }
            break;
        }
        return prevDirection;
      });
    })

  },[]);

  function PlayerMovement(){
    if(playerDirection=="right" && playerCoordinate.left+index<mapSize){
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left-index-index , top:playerCoordinate.top}])
      setPlayerCoordinate({left:playerCoordinate.left+index , top:playerCoordinate.top})
      return
    }
    if(playerDirection=="left" && playerCoordinate.left!=0){
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left , top:playerCoordinate.top}])
      setPlayerCoordinate({left:playerCoordinate.left-index , top:playerCoordinate.top})
      return
    }
    if(playerDirection=="down" && playerCoordinate.top+index<mapSize){
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left , top:playerCoordinate.top}])
      setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top+index})
      return
    }
    if(playerDirection=="up" && playerCoordinate.top!=0){
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left , top:playerCoordinate.top}])
      setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top-index})
      return
    }
  }

  useInterval(()=>{
    PlayerMovement();
  },1000);

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-red-300'>
      <div ref={mapRef} className='w-600 h-600 bg-orange-300 relative'>
        {/* head */}
        <div
          style={{
            width:index&&index,
            height:index&&index,
            backgroundColor:"blue",
            position:"absolute",
            left:playerCoordinate.left,
            top:playerCoordinate.top
          }}
        >
        {/* body */}
        {
          playerBodyCoords&&playerBodyCoords.map((coords,i)=>{
            return(
              <div
                style={{
                  width:index&&index,
                  height:index&&index,
                  backgroundColor:"red",
                  position:"absolute",
                  left:coords&&coords.left,
                  top:coords&&coords.top
                }}
                key={i}
              >
              </div>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}
