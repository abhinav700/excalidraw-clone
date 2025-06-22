"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [slug, setSlug] = useState("");
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
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
          }}
          style={{padding:"5px 5px"}}
          type="text"
          placeholder="Room name"
        />
        <button
          onClick={(e) => {
            router.push(`/room/${slug}`);
          }}
          style={{padding:"5px 5px",margin:"10px 0px", width: "60%", backgroundColor:"white", color:"black"}}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;