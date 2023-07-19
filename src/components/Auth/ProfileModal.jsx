import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';
import Button from '../Button';
import { getUsers } from '../../api/users';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

export const PORTAL_MODAL = 'portal-root';

const ProfileModal = ({ isOpen, setIsOpen }) => {
  // 로그인한 userId
  const { user } = useSelector((state) => state.user);
  const userId = user.userId;

  // DB의 users 컬렉션에서 모든 user 정보 가져와서 -> 로그인한 userId에 해당하는 값만 data 변수에 담기
  const { isLoading, error, data: allUsers } = useQuery(['users'], getUsers);
  const data = allUsers?.find((user) => user.userId === userId);

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [checkName, setCheckName] = useState('');
  const [checkCurrentPassword, setCheckCurrentPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [checkConfirmPassword, setCheckConfirmPassword] = useState('');

  // 회원정보 정규표현식 필터
  const nameRegEx = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{2,16}$/;
  const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  // 검사 전부 true 시 '수정' 버튼 활성화(disabled = false)
  const nameCheck = (name) => {
    setCheckName(nameRegEx.test(name));
  };
  const currentPasswordCheck = (currentPassword) => {
    setCheckCurrentPassword(passwordRegEx.test(currentPassword));
  };
  const newPasswordCheck = (newPassword, compareCurrentPassword = currentPassword) => {
    setCheckNewPassword(passwordRegEx.test(newPassword) && newPassword !== compareCurrentPassword);
  };
  const confirmPasswordCheck = (confirmPassword, compareNewPassword = newPassword) => {
    setCheckConfirmPassword(confirmPassword === compareNewPassword);
  };

  // input 관리
  const nameController = (e) => {
    setName(e.target.value);
    nameCheck(e.target.value);
  };
  const currentPasswordController = (e) => {
    const compareCurrentPassword = e.target.value;
    setCurrentPassword(compareCurrentPassword);
    currentPasswordCheck(compareCurrentPassword);
    newPasswordCheck(newPassword, compareCurrentPassword);
  };
  const newPasswordController = (e) => {
    const compareNewPassword = e.target.value;
    setNewPassword(compareNewPassword);
    newPasswordCheck(compareNewPassword);
    confirmPasswordCheck(confirmPassword, compareNewPassword); // pass the new password as an argument
  };
  const confirmPasswordController = (e) => {
    setConfirmPassword(e.target.value);
    confirmPasswordCheck(e.target.value);
  };

  // 수정 버튼 클릭 시
  // firebase auth 비밀번호 수정 & DB에 userName 업데이트 & userSlice에 userName 업데이트

  // 수정 모달창 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return isOpen
    ? createPortal(
        <Outer onClick={closeHandler}>
          <Inner onClick={stopPropagation}>
            <p>프로필을 수정해볼까요?</p>

            <Input type="text" name="name" value={name} onChange={nameController} placeholder="이름" autoFocus />
            {checkName === true ? (
              <StP style={{ color: 'var(--color_black)' }}>사용 가능한 이름입니다.</StP>
            ) : name ? (
              <StP>2자 이상 16자 내 영어, 한글로 구성해주세요.</StP>
            ) : (
              <br />
            )}

            <Input type="email" name="email" value={data?.userEmail} disabled />
            <br />

            <Input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={currentPasswordController}
              placeholder="현재 비밀번호"
            />
            {checkCurrentPassword === true ? (
              <br />
            ) : currentPassword ? (
              <StP>영문, 숫자, 특수문자를 조합하여 8-16자 로 입력해주세요.</StP>
            ) : (
              <br />
            )}

            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={newPasswordController}
              placeholder="새로운 비밀번호"
            />
            {checkNewPassword === true ? (
              <StP style={{ color: 'var(--color_black)' }}>사용 가능한 비밀번호입니다.</StP>
            ) : newPassword && newPassword === currentPassword ? (
              <StP>현재 비밀번호와 입력값이 동일합니다.</StP>
            ) : newPassword ? (
              <StP>영문, 숫자, 특수문자를 조합하여 8-16자 로 입력해주세요.</StP>
            ) : (
              <br />
            )}

            <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={confirmPasswordController}
              placeholder="비밀번호 확인"
            />
            {confirmPassword && checkConfirmPassword === true ? (
              <StP style={{ color: 'var(--color_black)' }}>비밀번호가 일치합니다.</StP>
            ) : confirmPassword && confirmPassword !== newPassword ? (
              <StP>비밀번호가 일치하지 않습니다.</StP>
            ) : (
              <br />
            )}

            <StButtonSet>
              <SignUpButton
                type="submit"
                color="navy"
                size="small"
                disabled={checkName && checkCurrentPassword && checkNewPassword && checkConfirmPassword ? false : true}
              >
                수정
              </SignUpButton>
              <Button color="navy" size="small" onClick={closeHandler}>
                닫기
              </Button>
            </StButtonSet>
          </Inner>
        </Outer>,
        document.getElementById(PORTAL_MODAL)
      )
    : null;
};

export default ProfileModal;

const Outer = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 100;
`;

const Inner = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  min-width: 30vw;
  padding: 100px;
  background-color: var(--color_pink2);
  border-radius: 10px;

  p {
    font-size: larger;
    margin-bottom: 30px;
  }
`;

const Input = styled.input`
  width: 15rem;
  margin-top: 10px;
  padding: 5px;
  background-color: var(--color_pink3);
  border: 1px solid var(--color_pink1);
  border-radius: 5px;
  outline: none;
  &:focus {
    border: 2px solid var(--color_pink1);
  }
`;

const StButtonSet = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 5px;
`;

const SignUpButton = styled(Button)`
  opacity: ${(props) => (props.disabled ? '0.6' : '1')};
  cursor: ${(props) => (props.disabled ? 'auto' : 'pointer')};
`;

const StP = styled.h2`
  margin-top: 5px;
  font-size: 13px;
  color: var(--color_pink1);
`;

// auth 비밀번호 변경 코드

// const handleSubmit = async (e) => {
//   e.preventDefault();

//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         const credentials = EmailAuthProvider.credential(user.email, currentPassword);

//         await reauthenticateWithCredential(user, credentials);
//         await updatePassword(user, newPassword);

//         setCurrentPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setErrorMessage('');
//         alert('비밀번호를 변경했습니다');
//         window.location.reload();
//       } catch (error) {
//         setErrorMessage('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
//         console.log('비밀번호 변경 실패', error);
//       }

//   };
