// Home.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/Auth';

// 스타일드 컴포넌트 상단에 정의
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const Nav = styled.nav`
  margin-top: 20px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: inline;
  margin: 0 10px;
  position: relative;

  &::after {
    content: '|';
    position: absolute;
    right: -12px; /* 막대와 텍스트 간격 조정 */
    color: #333; /* 막대 색상 */
  }

  &:last-child::after {
    content: ''; /* 마지막 항목에는 막대 표시 안 함 */
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  all: unset;
  text-decoration: none;
  color: #007bff;
  &:hover {
    text-decoration: underline;
  }
`;

const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null); // 이전의 오류 메시지를 지웁니다
      await signOut();
      // 상태 업데이트 후 UI 새로 고침
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setLogoutError(
        '로그아웃 처리 중 문제가 발생했습니다. 나중에 다시 시도해 주세요.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Container>
      <Title>메인페이지 입니다.</Title>
      <Nav>
        <List>
          {user ? (
            <>
              <ListItem>
                <StyledLink to="/profile">프로필</StyledLink>
              </ListItem>
              <ListItem>
                <Button onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Button>
              </ListItem>
              {logoutError && <p style={{ color: 'red' }}>{logoutError}</p>}
            </>
          ) : (
            <>
              <ListItem>
                <StyledLink to="/login">로그인</StyledLink>
              </ListItem>
              <ListItem>
                <StyledLink to="/forgot_password">비밀번호 찾기</StyledLink>
              </ListItem>
              <ListItem>
                <StyledLink to="/signup">회원가입</StyledLink>
              </ListItem>
            </>
          )}
        </List>
      </Nav>
    </Container>
  );
};

export default Home;
