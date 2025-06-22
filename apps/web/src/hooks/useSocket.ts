import { useEffect, useState } from "react";
import {JOIN_ROOM} from "@repo/common/constants"
const useSocket = ({roomId} : {roomId: string}) => {
  const [loading, setLoading]= useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    try{
      const token = localStorage.getItem('token');
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

      ws.onopen = () => {
        setSocket(ws);

        const data = JSON.stringify({
          type: JOIN_ROOM,
          roomId
        });

        ws.send(data);
      };
      
      return () => {
        ws.close();
      }
    } catch (err){
      console.log(err);
    }finally{
      setLoading((loading :boolean) => false);
    }
  }, [])

  return {socket, loading};
}

export default useSocket;