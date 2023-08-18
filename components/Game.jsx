import Image from 'next/image'
import { Inter, Sen } from 'next/font/google'
import { useEffect, useState, useRef } from 'react'
import { ably } from '@/config/ablyConfig'
import useInterval from 'use-interval'

export default function Game() {
  const data=sessionStorage.getItem("player");
  const lobby=ably.channels.get(JSON.parse(data).lobby);
  //map
  const [mapSize,setMapSize]=useState(0);
  const mapRef = useRef(null);
  const scale=10;
  const [index,setIndex]=useState(10);
  //which player ? (blue or red) 
  const [myColor,setMyColor]=useState("");
  //player
  const [playerCoordinate,setPlayerCoordinate]=useState({left:100 , top:100});
  const [playerDirection,setPlayerDirection]=useState("right");
  const [playerBodyCoords,setPlayerBodyCoords]=useState([]);
  const [isDead,setIsDead]=useState(false);
  //opponent
  const [opponentJoined,setOpponentJoined]=useState(false);
  const [opponent,setOpponent]=useState();

  function transferData(){
    lobby.publish(
      JSON.parse(data).name ,
      {
        direction:playerDirection,
        body:playerBodyCoords,
        isDead:isDead,
        head:playerCoordinate,
        number:JSON.parse(data).number
      }
    )
  }

  useEffect(()=>{
    transferData();
  },[])

  lobby.subscribe((message)=>{
    if(JSON.parse(data).name && message.name!==JSON.parse(data).name){
      //oponnent joined
      setOpponentJoined(true);
      //am i red or blue ? blue<red
      if(JSON.parse(data).number<message.data.number){
        //my opponent has bigger number so im blue
        setMyColor("blue");
      }else{
        //my opoonent has lesser number so im red
        setMyColor("red")
      }
      // setOpponent(message.data)
    }
    // console.log(message.name)

  });

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

    if(!localStorage.getItem("room")){
      
    }

  },[]);

  function PlayerMovement(){
    if(playerDirection=="right"){
      if(playerCoordinate.left+index<mapSize){
        setPlayerCoordinate({left:playerCoordinate.left+index , top:playerCoordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(playerDirection=="left"){
      if(playerCoordinate.left!=0){
        setPlayerCoordinate({left:playerCoordinate.left-index , top:playerCoordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(playerDirection=="down"){
      if(playerCoordinate.top+index<mapSize){
        setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top+index})
      }else{
        setIsDead(true)
      }
    }

    if(playerDirection=="up"){
      if(playerCoordinate.top!=0){
        setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top-index})
      }else{
        setIsDead(true)
      }
    }
  }

  useInterval(()=>{
    if(opponentJoined){
      PlayerMovement();
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left , top:playerCoordinate.top}]);
      transferData()
    }
  },1000);

  // if(isDead){
  //   alert("Dead")
  // }

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
            top:playerCoordinate.top,
            transition:"200ms"
          }}
        ></div>
        {
          playerBodyCoords.map((body,i)=>{
            return(
              <div
                style={{
                  width:index&&index,
                  height:index&&index,
                  backgroundColor:"blue",
                  position:"absolute",
                  left:body.left,
                  top:body.top,
                  transition:"200ms"
                }}
                key={i}
              >
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
