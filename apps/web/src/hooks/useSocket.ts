import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "../config";

const useSocket = () => {
  const [loading, setLoading]= useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZDExOGFkNS0wM2NlLTQ1MjktOTJlZS0zOTU1MzdkNTQxNzEiLCJpYXQiOjE3NDI3MTE4ODN9.GiXVCXQKit8GZsRZaBOBQOLvY7E4Bg3FfxtAjxTM7ms`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    }
  }, [])

  return {socket, loading};
}

export default useSocket;