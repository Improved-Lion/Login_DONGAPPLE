import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './../firebaseConfig';
import styled, { keyframes } from 'styled-components';
import * as yup from 'yup'; // yu

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

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 유효성 검사
      await validationSchema.validate({ email, password, confirmPassword });
      // 비밀번호 일치 확인
      if (password !== confirmPassword) {
        throw new yup.ValidationError(
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
          null,
          'confirmPassword'
        );
      }

      await createUserWithEmailAndPassword(auth, email, password);
      alert('회원가입성공');
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        setError(validationError.message);
      } else {
        setError('회원가입에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    }
  };
  return (
    <>
      <h1>회원가입</h1>
      <Container>
        <Form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <StyledLabel>비밀번호</StyledLabel>
            <StyledInput
              type="password"
              id="password"
              placeholder="6글자 이상의 비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledInput
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 한번더 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputWrapper>
          <StyledSubmit type="submit" value={'가입하기'} />
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

export default Signup;
