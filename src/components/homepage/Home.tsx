import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import Loading from "../Loading";

const Container = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Button = styled.button`
  width: 200px;
  height: 60px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 20px;
`;

interface Props {
  socket: ReturnType<typeof io>;
}

function Home(props: Props) {
  const socket = props.socket;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMatchClick = () => {
    socket.emit('match');
    setLoading(true);
  };
  
  useEffect(() => {
    // 매칭 완료 이벤트를 수신하는 리스너 설정
    socket.on("matched", (id) => {
      setLoading(false); // 매칭 완료 시 로딩 상태 업데이트
      navigate(`/chat/${id}`, { state: id }); // 매칭 완료 시 방 페이지로 이동
    });

    return () => {
      socket.off("matched"); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, [navigate, socket]);

  return (
    <>
      <Container>
        {loading ? 
          <Loading /> : 
          <Button onClick={handleMatchClick}>
            매칭하기
          </Button>}
      </Container>
    </>
  );
}

export default Home;
