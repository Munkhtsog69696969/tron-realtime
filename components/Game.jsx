import Image from 'next/image'
import { Inter, Sen } from 'next/font/google'
import { useEffect, useState, useRef } from 'react'
import { ably } from '@/config/ablyConfig'
import useInterval from 'use-interval'

export default function Game() {
  const playerData=JSON.parse(sessionStorage.getItem("player"));
  const lobby=ably.channels.get(playerData.lobby);
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
  //my head and body
  const [myHead,setMyHead]=useState();
  const [myBody,setMyBody]=useState();
  const [myDirection,setMyDirection]=useState();
  //drawing players
  const [drawPlayer1Head,setDrawPlayer1Head]=useState();
  const [drawPlayer1Body,setDrawPlayer1Body]=useState([]);
  const [drawPlayer2Head,setDrawPlayer2Head]=useState();
  const [drawPlayer2Body,setDrawPlayer2Body]=useState([]);

  function transferData(){
    lobby.publish(
      playerData.name ,
      {
        number:playerData.number ,
        head:myHead,
        body:myBody,
        direction:myDirection
      }
    )
  }

  useEffect(()=>{
    transferData();
  },[])

  //lisents
  lobby.subscribe((message)=>{
    if(message.name!=playerData.name){
      setOpponentJoined(true);

      if(message.data.number>=playerData.number){
        //opponent is red
        setMyColor("blue");
        setMyHead(playerCoordinate);
        setMyBody(playerBodyCoords);
        setMyDirection(playerDirection);

        setDrawPlayer1Head(playerCoordinate);
        setDrawPlayer1Body(playerBodyCoords);
        setDrawPlayer2Head(message.data.head);
        setDrawPlayer2Body(message.data.body)
      }else{
        //opponent is blue
        setMyColor("red");
        setMyHead(player2Coordinate);
        setMyBody(player2BodyCoords);
        setMyDirection(player2Direction);

        setDrawPlayer1Head(message.data.head);
        setDrawPlayer1Body(message.data.body);
        setDrawPlayer2Head(player2Coordinate);
        setDrawPlayer2Body(player2BodyCoords)
      }
    }
    console.log(message)

    // if(opponentJoined){

    // }
  });

  console.log("1",playerDirection)
  console.log("2",player2Direction)

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

  function PlayerMovement(){
    if(myColor=="blue" && myDirection=="right"){
      if(playerCoordinate.left+index<mapSize){
        setPlayerCoordinate({left:playerCoordinate.left+index , top:playerCoordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="blue" && myDirection=="left"){
      if(playerCoordinate.left!=0){
        setPlayerCoordinate({left:playerCoordinate.left-index , top:playerCoordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="blue" && myDirection=="down"){
      if(playerCoordinate.top+index<mapSize){
        setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top+index})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="blue" && myDirection=="up"){
      if(playerCoordinate.top!=0){
        setPlayerCoordinate({left:playerCoordinate.left , top:playerCoordinate.top-index})
      }else{
        setIsDead(true)
      }
    }
  }

  function Player2Movement(){
    if(myColor=="red" && myDirection=="right"){
      if(player2Coordinate.left+index<mapSize){
        setPlayer2Coordinate({left:player2Coordinate.left+index , top:player2Coordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="red" && myDirection=="left"){
      if(player2Coordinate.left!=0){
        setPlayer2Coordinate({left:player2Coordinate.left-index , top:player2Coordinate.top})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="red" && myDirection=="down"){
      if(player2Coordinate.top+index<mapSize){
        setPlayer2Coordinate({left:player2Coordinate.left , top:player2Coordinate.top+index})
      }else{
        setIsDead(true)
      }
    }

    if(myColor=="red" && myDirection=="up"){
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
    }
    transferData()
  },400);

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-red-300'>
      <div className='fixed top-8'>Your color is {myColor&&myColor}</div>
      <div className='fixed top-0'>{opponentJoined ? "opponent joined" : "opponent not joined"}</div>
      <div ref={mapRef} className='w-600 h-600 bg-orange-300 relative'>
        {/* head */}
        <div
          style={{
            width:index&&index,
            height:index&&index,
            backgroundColor:"blue",
            position:"absolute",
            left:drawPlayer1Head&&drawPlayer1Head.left,
            top:drawPlayer1Head&&drawPlayer1Head.top,
            transition:"200ms"
          }}
        ></div>
        {
          drawPlayer1Body&&drawPlayer1Body.map((body,i)=>{
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
            left:drawPlayer2Head&&drawPlayer2Head.left,
            top:drawPlayer2Head&&drawPlayer2Head.top,
            transition:"200ms"
          }}
        ></div>
        {
          drawPlayer2Body&&drawPlayer2Body.map((body,i)=>{
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
