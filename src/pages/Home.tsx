import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 스타일드 컴포넌트 상단에 정의
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
  color: #;
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

const Home: React.FC = () => {
  return (
    <Container>
      <Title>메인페이지 입니다.</Title>
      <Nav>
        <List>
          <ListItem>
            <StyledLink to="/login">로그인</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/forgot_password">비밀번호 찾기</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/signup">회원가입</StyledLink>
          </ListItem>
        </List>
      </Nav>
    </Container>
  );
};

export default Home;
