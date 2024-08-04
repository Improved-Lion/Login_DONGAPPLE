import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  updateProfile,
} from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from './../firebaseConfig';
import styled, { keyframes } from 'styled-components';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const storage = getStorage();

// Styled Components
const Container = styled.div`
  padding: 3.75rem 6.875rem;
  margin: auto;
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
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  color: #3e4654;
  font-size: 1rem;
  cursor: pointer;
`;

const StyledInput = styled.input`
  padding: 0 1.5rem;
  border: 1px solid gray;
  border-radius: 4px;
  height: 3.75rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border: 1px solid #496bf3;
    box-shadow: 0 0 0 2px rgba(73, 107, 243, 0.9);
    outline: none;
  }
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid gray;
  border-radius: 4px;
  background-color: #496bf3;
  color: white;
  cursor: pointer;
  height: 3.75rem;
  min-width: 6rem;
  &:hover {
    background-color: #2548d2;
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
  cursor: pointer;

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

// Validation Schema
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('이메일은 필수 입력 항목입니다.')
    .email('유효한 이메일 주소를 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호는 필수 입력 항목입니다.')
    .min(6, '비밀번호는 6자 이상입니다.'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), undefined],
      '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
    )
    .required('비밀번호 확인은 필수 입력 항목입니다.'),
});

// Component
const Signup: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailCheckError, setEmailCheckError] = useState<string>(''); // 이메일 중복 확인 오류
  // 이미지 추가
  const [communityImage, setCommunityImage] = useState<string>(
    `${import.meta.env.VITE_PUBLIC_URL}/img/default_image3.png`
  );

  // 이미지 함수 __ 현재는 보안 문제가 있을수 있음.
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setCommunityImage(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출

  const handleEmailChecked = async () => {
    // 이메일 형식 검증
    try {
      await yup.string().email().validate(email);
      try {
        console.log('이메일 정상');
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setEmailCheckError('이미 사용 중인 이메일입니다.');
          console.log('사용중');
        } else {
          setEmailCheckError('');
          console.log('사용가능');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailCheckError('이메일 중복 확인에 실패했습니다.');
      }
    } catch (validationError) {
      setEmailCheckError('유효한 이메일 주소를 입력해주세요.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 유효성 검사
      await validationSchema.validate({ email, password, confirmPassword });

      // 회원가입 처리
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 사용자 프로필 업데이트
      try {
        await updateProfile(user, {
          displayName: displayName,
          photoURL: communityImage,
        });
      } catch (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);

        // 프로필 업데이트 실패 시 사용자 계정 삭제
        await deleteUser(user);

        setError('회원가입에 실패했습니다. 프로필 업데이트에 실패했습니다.');
        return; // 이후 코드 실행을 중단합니다.
      }

      // 회원가입 성공 시 로그인 페이지로 이동
      alert('회원가입 성공');
      navigate('/login');
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
          <InputWrapper style={{ alignItems: 'center' }}>
            {communityImage &&
            communityImage !==
              `${import.meta.env.VITE_PUBLIC_URL}/img/default_image3.png` ? (
              <img
                src={communityImage}
                alt="Preview"
                style={{ width: 100, height: 100, borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: '#d3d3d3', // 회색 배경
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff', // 흰색 텍스트
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                이미지 없음
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: '180px' }}
            />
          </InputWrapper>

          <InputWrapper>
            <StyledLabel>이름</StyledLabel>
            <StyledInput
              type="text"
              id="name"
              placeholder="이름을 입력해주세요"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <StyledLabel>이메일</StyledLabel>
            <InputWithButton>
              <StyledInput
                type="email"
                id="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledButton type="button" onClick={handleEmailChecked}>
                중복확인 <br /> (미완성)
              </StyledButton>
            </InputWithButton>
            {/* 이메일 중복 확인 오류 메시지 */}
            {emailCheckError && <ErrorMessage>{emailCheckError}</ErrorMessage>}
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
            <StyledLabel htmlFor="confirmPassword">비밀번호 확인</StyledLabel>
            <StyledInput
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 한번 더 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputWrapper>
          <StyledSubmit type="submit" value="가입하기" />
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}
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
``;
