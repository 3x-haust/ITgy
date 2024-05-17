import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './components/NotFound';
import { io } from 'socket.io-client';
import Home from './components/homepage/Home';
import Chatting from './components/chattingpage/Chatting';

const so = io('http://localhost:4000');

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={so}/>} />
          <Route path="/chat/:id" element={<Chatting socket={so}/>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
