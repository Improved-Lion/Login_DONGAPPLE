import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './../firebaseConfig'; // Firebase config

// 애니메이션 정의
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

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

const ErrorMessage = styled.p`
  color: red;
  animation: ${shake} 0.25s ease;
`;

// 비밀번호 찾기 페이지 컴포넌트
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('비밀번호 재설정 이메일이 발송되었습니다.');
      setEmail(''); // 이메일 입력 필드 초기화
    } catch (error) {
      setError('이메일 발송에 실패했습니다. 이메일 주소를 확인해주세요.');
    }
  };

  return (
    <>
      <h1>비밀번호 찾기</h1>
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
          <StyledSubmit type="submit" value="비밀번호 재설정 이메일 보내기" />
        </Form>

        {error && <ErrorMessage key={error}>{error}</ErrorMessage>}
        {success && <p>{success}</p>}
        <Link to="/login">로그인 페이지로 돌아가기</Link>
      </Container>
    </>
  );
};

export default ForgotPassword;
