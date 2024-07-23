import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 3.75rem 6.875rem;
  margin: auto;
  // border: 0.0625rem solid black;
  border-radius: 1rem;
  box-shadow: 0 0 20px 5px rgba(71, 111, 243, 0.5);
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  & input:focus ~ label {
    color: #496bf3;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &:focus-within label {
    color: #496bf3;
  }
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
  &:focus {
    border: 1px solid #496bf3;
    box-shadow: 0 0 0 2px rgba(73, 107, 243, 0.9);
    outline: none;
  }
`;

const StyledSubmit = styled.input`
  font-size: 1rem;
  padding: 0 1.5rem;
  border: 1px solid gray;
  border-radius: 4px;
  height: 3.75rem;
  background-color: #496bf3;
  color: #fff;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    background-color: #2548d2;
  }
`;

const Signup: React.FC = () => {
  return (
    <>
      <h1>회원가입</h1>
      <Container>
        <Form>
          <InputWrapper>
            <StyledLabel>이름</StyledLabel>
            <StyledInput
              type="string"
              id="name"
              placeholder="이름을 입력해주세요"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledLabel>이메일</StyledLabel>
            <StyledInput
              type="email"
              id="email"
              placeholder="이메일을 입력해주세요"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledLabel>비밀번호</StyledLabel>
            <StyledInput
              type="password"
              id="password"
              placeholder="6글자 이상으 비밀번호를 입력해주세요"
            />
            <StyledInput
              type="password"
              id="password"
              placeholder="비밀번호를 한번더 입력해주세요"
            />
          </InputWrapper>
          <StyledSubmit type="submit" value={'가입하기'} />
        </Form>
      </Container>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/forgot_password">Forgot Password</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Signup;
