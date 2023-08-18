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
  //player blue
  const [playerCoordinate,setPlayerCoordinate]=useState({left:100 , top:100});
  const [playerDirection,setPlayerDirection]=useState("right");
  const [playerBodyCoords,setPlayerBodyCoords]=useState([]);
  //player red
  const [player2Coordinate,setPlayer2Coordinate]=useState({left:400 , top:400});
  const [player2Direction,setPlayer2Direction]=useState("left");
  const [player2BodyCoords,setPlayer2BodyCoords]=useState([]);
  const [isDead,setIsDead]=useState(false);
  //opponent
  const [opponentJoined,setOpponentJoined]=useState(false);
  const [opponent,setOpponent]=useState();
  //drawing players
  const [drawPlayer1Head,setDrawPlayer1Head]=useState();
  const [drawPlayer1Body,setDrawPlayer1Body]=useState([]);
  const [drawPlayer2Head,setDrawPlayer2Head]=useState();
  const [drawPlayer2Body,setDrawPlayer2Body]=useState([]);

  function transferData(){
    lobby.publish(
      JSON.parse(data).name ,
      {
        direction1:playerDirection,
        body:playerBodyCoords,
        head:playerCoordinate,
        number:JSON.parse(data).number,

        direction2:player2Direction,
        body2:player2BodyCoords,
        head2:player2Coordinate,
        number2:JSON.parse(data).number
      }
    )
  }

  useEffect(()=>{
    // transferData();
  },[])

  lobby.subscribe((message)=>{
    if(JSON.parse(data).name && message.name!==JSON.parse(data).name){
      //oponnent joined
      setOpponentJoined(true);
      //am i red or blue ? blue<red
      if(JSON.parse(data).number<message.data.number){
        //my opponent has bigger number so im blue
        setMyColor("blue");
        setDrawPlayer1Head(message.data.head);
        setDrawPlayer2Head(message.data.head2);


      }else{
        //my opoonent has lesser number so im red
        setMyColor("red")
      }
    }else{

    }

  });

  useEffect(()=>{
    if(mapRef){
      setMapSize(mapRef.current.offsetWidth);
    }
    if(mapSize){
      setIndex(mapSize&&mapSize/scale);
    }

    window.addEventListener("keydown" , (event)=>{
      if(myColor=="blue"){
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
                console.log(playerDirection)
                return "down";
              }
              break;
          }
          return prevDirection;
        });
      }else if(myColor=="red"){
        setPlayer2Direction((prevDirection) => {
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
      }
    })

  },[]);
  // console.log(myColor)

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

  function Player2Movement(){
    if(player2Direction=="right"){
      if(player2Coordinate.left+index<mapSize){
        setPlayer2Coordinate({left:player2Coordinate.left+index , top:player2Coordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(player2Direction=="left"){
      if(player2Coordinate.left!=0){
        setPlayer2Coordinate({left:player2Coordinate.left-index , top:player2Coordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(player2Direction=="down"){
      if(player2Coordinate.top+index<mapSize){
        setPlayer2Coordinate({left:player2Coordinate.left , top:player2Coordinate.top+index})
      }else{
        setIsDead(true)
      }
    }

    if(player2Direction=="up"){
      if(player2Coordinate.top!=0){
        setPlayer2Coordinate({left:player2Coordinate.left , top:player2Coordinate.top-index})
      }else{
        setIsDead(true)
      }
    }
  }

  useInterval(()=>{
    if(opponentJoined){
      PlayerMovement();
      Player2Movement();
      setPlayerBodyCoords([...playerBodyCoords , {left:playerCoordinate.left , top:playerCoordinate.top}]);
      setPlayer2BodyCoords([...player2BodyCoords , {left:player2Coordinate.left , top:player2Coordinate.top}]);
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

        <div
          style={{
            width:index&&index,
            height:index&&index,
            backgroundColor:"red",
            position:"absolute",
            left:player2Coordinate.left,
            top:player2Coordinate.top,
            transition:"200ms"
          }}
        ></div>
        {
          player2BodyCoords.map((body,i)=>{
            return(
              <div
                style={{
                  width:index&&index,
                  height:index&&index,
                  backgroundColor:"red",
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
