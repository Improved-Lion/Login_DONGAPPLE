import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled
const Container = styled.div`
  padding: 3.75rem 6.875rem;
  margin: auto;
  border: 0.0625rem solid black;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  color: #3e4654;
  font-size: 1rem;
  cursor: pointer;
`;

const StyledInput = styled.input`
  padding: 0 1.5rem;
  border: 1px solid gray;
  border-radius: 4px;
  height: 3.75rem;
  // width: 100%;
`;

const StyledSubmit = styled.input`
  font-size: 1rem;
  padding: 0 1.5rem;
  border: 1px solid gray;
  border-radius: 4px;
  height: 3.75rem;
  background-color: #496bf3;
  color: #fff;
  &:hover {
    background-color: #2548d2;
  }
`;

const StyledLink = styled(Link)`
  font-size: 1rem;
  color: #496bf3;
  text-decoration: none;
  border: 0.0625rem solid #496bf3;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.75rem;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #2548d2;
    color: #fff;
  }
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;
// Script

// MarkUp

const Login: React.FC = () => {
  return (
    <div>
      <h1>로그인</h1>

      <Container>
        <Form>
          <StyledLabel htmlFor="email">이메일</StyledLabel>
          <StyledInput
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
          />

          <StyledLabel htmlFor="password"> 비밀번호</StyledLabel>

          <StyledInput
            type="password"
            id="password"
            placeholder="비밀번호을 입력해주세요"
          />

          <Link to="/forgot_password">비밀번호를 잊으셨나요?</Link>
          <StyledSubmit type="submit" value="로그인" />
          <StyledLink to="/signup">회원가입</StyledLink>
        </Form>

        <p>소셜아이디로 간편하게 로그인할 수 있습니다.</p>
        <StyledUl>
          <li>네이버로 로그인</li>
          <li>카카오로 로그인</li>
          <li>구글로 로그인</li>
        </StyledUl>
      </Container>
    </div>
  );
};

export default Login;
