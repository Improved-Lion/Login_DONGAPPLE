import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../firebaseConfig';
import * as yup from 'yup'; // yup 불러오기

// Styled Components
const Container = styled.div`
  padding: 3.75rem 6.875rem;
  margin: auto;
  box-shadow: 0 0 20px 5px rgba(71, 111, 243, 0.5);
  border-radius: 1rem;
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
  color: #3e4654;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
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
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

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

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const ErrorMessage = styled.p`
  color: red;
  animation: ${shake} 0.25s ease;
`;

// 유효성 검사 스키마 생성
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('유효한 이메일 주소를 입력해주세요.')
    .required('이메일은 필수 입력 항목입니다.'),
  password: yup
    .string()
    .min(6, '비밀번호는 6자 이상입니다.')
    .required('비밀번호는 필수 입력 항목입니다.'),
});

// Component
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 입력값 검증
    try {
      await validationSchema.validate({ email, password });
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공');
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        setError(validationError.message);
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    }
  };

  return (
    <>
      <h1>로그인</h1>
      <Container>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <StyledLabel htmlFor="email">이메일</StyledLabel>
            <StyledInput
              type="email"
              id="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper>
            <StyledLabel htmlFor="password">비밀번호</StyledLabel>
            <StyledInput
              type="password"
              id="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>

          <Link to="/forgot_password">비밀번호를 잊으셨나요?</Link>
          <StyledSubmit type="submit" value="로그인" />
          <StyledLink to="/signup">회원가입</StyledLink>
        </Form>

        {error && <ErrorMessage key={error}>{error}</ErrorMessage>}

        <p>소셜아이디로 간편하게 로그인할 수 있습니다.</p>
        <StyledUl>
          <li>네이버로 로그인</li>
          <li>카카오로 로그인</li>
          <li>구글로 로그인</li>
        </StyledUl>
      </Container>
    </>
  );
};

export default Login;
