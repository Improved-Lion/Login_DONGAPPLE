import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
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
  min-width: 8rem;
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

const Signup: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailCheckError, setEmailCheckError] = useState<string>(''); // 이메일 중복 확인 오류
  const [communityImage, setCommunityImage] = useState<string>(
    `${import.meta.env.VITE_PUBLIC_URL}/img/default_image3.png`
  );
  const [emailChecked, setEmailChecked] = useState<boolean>(false);

  // 이미지 함수
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

  const navigate = useNavigate();

  // 임의의 비밀번호 생성
  const generateRandomPassword = () => {
    const length = 12; // 비밀번호 길이
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleEmailChecked = async () => {
    try {
      await yup.string().email().validate(email);

      // 이메일 중복 확인
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setEmailCheckError('이미 사용 중인 이메일입니다.');
        return;
      }

      // 임의의 비밀번호 생성
      const tempPassword = generateRandomPassword();

      // 사용자 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        tempPassword
      );
      const user = userCredential.user;

      // 이메일 인증 메일 발송
      await sendEmailVerification(user);

      // 인증 메일 발송 후 메시지 표시
      alert('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
      console.log('이메일 보냄');
      // 이메일 인증 상태를 업데이트
      setEmailChecked(true);
      console.log('인증 완');
      setEmailCheckError('');
    } catch (error) {
      console.error(
        'Error checking email or sending verification email:',
        error
      );
      setEmailCheckError('이메일 인증에 실패했습니다.');
      setEmailChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('버튼 클릭');
    if (!emailChecked) {
      console.log('이메일 인증 미완료');
      setError('이메일 인증이 완료되지 않았습니다.');
      return;
    }

    try {
      await validationSchema.validate({ email, password, confirmPassword });
      console.log('기존 사용자 확인');
      // 기존 사용자 확인
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log(methods);
      if (methods.length > 0) {
        // 기존 사용자가 있는 경우
        const user = auth.currentUser; // 현재 인증된 사용자를 가져옵니다
        console.log('기존 사용자 확인됨');
        // 이메일 인증 상태 확인
        if (user) {
          try {
            console.log('인증상태 확인');
            // 이메일 인증 상태를 확인합니다.
            const userInfo = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            if (userInfo.user.providerId === 'password') {
              console.log('인증 사용자 삭제');
              // 인증된 사용자 삭제
              await deleteUser(user);
            }
          } catch (error) {
            console.error('Error signing in with email and password:', error);
          }
        }
      }
      console.log('사용자 계정 생성');
      // 사용자 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('프로필 업데이트');
      // 사용자 프로필 업데이트
      await updateProfile(user, {
        displayName: displayName,
        photoURL: communityImage,
      });

      console.log('인증 메일 발송');
      // 이메일 인증 메일 발송
      await sendEmailVerification(user);

      // 인증 메일 발송 후 메시지 표시
      alert('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');

      // 이메일 인증 상태를 업데이트
      setEmailChecked(false);
      setEmailCheckError('');

      // 가입 성공 메시지
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
                이메일 인증{' '}
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
