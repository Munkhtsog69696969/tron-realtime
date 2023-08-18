import { useState } from "react"
import { ably } from "@/config/ablyConfig";

export default function JoinGame(){
    const [name,setName]=useState("");
    const [lobby,setLobby]=useState("");

    function Enter(){
        if(name && lobby){
            sessionStorage.setItem("player" , JSON.stringify({name:name , lobby:lobby , number:Math.floor(100000 + Math.random() * 900000)}))
            window.location.reload()
        }
    }

    return(
        <div className="flex justify-center items-center w-screen h-screen bg-red-200">
            <div className="w-64 h-64 bg-white">
                <input
                    placeholder="Your name..."
                    onChange={(e)=>{setName(e.target.value)}}
                    value={name}
                />
                <input
                    placeholder="Lobby Id..."
                    onChange={(e)=>{setLobby(e.target.value)}}
                    value={lobby}
                />
                <div>
                    <button
                        onClick={Enter}
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    )
}