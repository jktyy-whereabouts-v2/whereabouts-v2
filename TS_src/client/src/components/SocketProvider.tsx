import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface Props {
  id: string;
  children: any;
};

export const SocketProvider = ({ id, children } : Props) => {
  const [socket, setSocket] = useState<any>(null);
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {query: { id }});
    setSocket(newSocket);
    newSocket.close();
    return (() => {
      newSocket.close();
    })
  }, [id]);
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}