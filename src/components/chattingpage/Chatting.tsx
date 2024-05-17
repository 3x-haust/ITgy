import styled from "styled-components";
import { MdSend } from 'react-icons/md';
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 20px;
  background-color: #f0f0f0;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  padding: 10px;
  margin-right: 20px; 
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 16px;
  margin-right: 40px;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: calc(100vh - 100px);
  overflow-y: auto;
  background-color: #f0f0f0;
  padding: 40px;
  li {
    font-size: 40px;
  }
`;

interface Props {
  socket: ReturnType<typeof io>;
}

const API_KEY  = process.env.REACT_APP_API_KEY;

function Chatting(props: Props) {
  const socket = props.socket;
  const { state } = useLocation();
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input') as HTMLInputElement;

    const message = input.value;
    const id = state as string;

    input.value = '';
    socket.emit('message', { id: id, message: message });
  }

  useEffect(() => {
    socket.on('messaged', (data) => {
      

      const ul = document.querySelector('.messages') as HTMLUListElement;
  
      // 메시지를 오른쪽 또는 왼쪽에 추가하기 위한 클래스명 결정
      const messageAlignment = data.user === socket.id ? 'right' : 'left';
  
      // 메시지에 적용할 스타일을 포함한 <li> 요소 생성
      const messageElement = `<li style="text-align: ${messageAlignment}">${data.message}</li>`;

      // fetch(`https://opendict.korean.go.kr/api/search?certkey_no=6594&key=${API_KEY}&target_type=search&req_type=json&part=word&q=${data.message}&sort=dict&start=1&num=10`)
      //   .then(response => {
      //     if (!response.ok) {
      //       throw new Error("HTTP error " + response.status);
      //     }
      //     return response.json();
      //   })
      //   .then(json => {
      //     console.log(json);
      //   })
      //   .catch(function() {
      //     console.log("API 요청에 문제가 발생했습니다.");
      //   });
  
      ul.innerHTML += messageElement;
    });
  
    return () => {
      socket.off('messaged');
    };
  }, [socket]);

  useEffect(() => {
    const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
      event.preventDefault();
      navigate('/');
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);  

  return (
    <>
      <Ul className="messages"></Ul>
      <Container>
        <form onSubmit={handleSubmit}>
          <Input type="text" placeholder="채팅하기 ..."/>
          <Button>
            <MdSend style={{ fontSize: 20 }} />
          </Button>
        </form>
      </Container>
    </>
  );
}

export default Chatting;
