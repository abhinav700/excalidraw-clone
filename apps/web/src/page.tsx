"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width:"100%"
    }}>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <input
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          style={{padding:"5px 5px"}}
          type="text"
          placeholder="Room id"
        />
        <button
          onClick={(e) => {
            router.push(`/room/${roomId}`);
          }}
          style={{padding:"5px 5px",margin:"10px 0px", width: "60%"}}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
