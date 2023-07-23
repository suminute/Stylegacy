import { createPortal } from 'react-dom';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { useMutation, useQueryClient } from 'react-query';
import { addUser } from '../../api/users';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage, toggleAlertModal } from '../../redux/modules/modalSlice';
import AlertModal from '../shared/AlertModal';

export const PORTAL_MODAL = 'portal-root';

const SignUpModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const modals = useSelector((state) => state.modals);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [checkName, setCheckName] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checkConfirmPassword, setCheckConfirmPassword] = useState('');

  // React-query -> 회원가입 시 users 컬렉션에 data 업데이트
  const queryClient = useQueryClient();
  const addUserMutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    }
  });

  // 회원정보 정규표현식 필터
  const nameRegEx = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{2,16}$/;
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  // 검사 전부 true 시 '가입하기' 버튼 활성화(disabled = false)
  const nameCheck = (name) => {
    setCheckName(nameRegEx.test(name));
  };
  const emailCheck = (email) => {
    setCheckEmail(emailRegEx.test(email));
  };
  const passwordCheck = (password) => {
    setCheckPassword(passwordRegEx.test(password));
  };
  const confirmPasswordCheck = (confirmPassword, comparePassword = password) => {
    setCheckConfirmPassword(confirmPassword === comparePassword);
  };

  // input 관리
  const nameController = (e) => {
    setName(e.target.value);
    nameCheck(e.target.value);
  };
  const emailController = (e) => {
    setEmail(e.target.value);
    emailCheck(e.target.value);
  };
  const passwordController = (e) => {
    const comparePassword = e.target.value;
    setPassword(comparePassword);
    passwordCheck(comparePassword);
    confirmPasswordCheck(confirmPassword, comparePassword);
  };
  const confirmPasswordController = (e) => {
    setConfirmPassword(e.target.value);
    confirmPasswordCheck(e.target.value);
  };

  // 회원가입 버튼
  const signUp = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: name });
      const newUser = {
        userEmail: email,
        userName: name,
        userId: user.uid,
        userImage: ''
      };
      // react-query로 users 컬렉션에 추가함
      addUserMutation.mutate(newUser);
      dispatch(setAlertMessage('회원가입에 성공하였습니다.'));
      dispatch(toggleAlertModal());
      setIsOpen(false);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('회원가입 에러', errorCode, errorMessage);
      if (errorCode === 'auth/email-already-in-use')
        dispatch(setAlertMessage('이미 존재하는 이메일 주소 입니다. 다른 이메일 주소를 이용해 주세요!'));
      dispatch(toggleAlertModal());
    }
  };

  // 회원가입 모달창 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {modals.isAlertModalOpen && (
        <AlertModal
          message={modals.alertMessage}
          isOpen={modals.isAlertModalOpen}
          setIsOpen={() => dispatch(toggleAlertModal())}
        />
      )}
      {isOpen
        ? createPortal(
            <Outer onClick={closeHandler}>
              <Inner onClick={stopPropagation} onSubmit={signUp}>
                <p>회원가입을 해볼까요?</p>
                <Input type="text" name="name" value={name} onChange={nameController} placeholder="이름" autoFocus />
                {checkName === true ? (
                  <StP style={{ color: 'var(--color_black)' }}>사용 가능한 이름입니다.</StP>
                ) : name ? (
                  <StP>2자 이상 16자 내 영어, 한글로 구성해주세요.</StP>
                ) : (
                  <br />
                )}
                <Input type="email" name="email" value={email} onChange={emailController} placeholder="이메일" />
                {checkEmail === true ? (
                  <StP style={{ color: 'var(--color_black)' }}>사용 가능한 이메일입니다.</StP>
                ) : email ? (
                  <StP>이메일 주소를 정확히 입력해주세요.</StP>
                ) : (
                  <br />
                )}
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={passwordController}
                  placeholder="비밀번호"
                />
                {checkPassword === true ? (
                  <StP style={{ color: 'var(--color_black)' }}>사용 가능한 비밀번호입니다.</StP>
                ) : password ? (
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
                ) : confirmPassword && confirmPassword !== password ? (
                  <StP>비밀번호가 일치하지 않습니다.</StP>
                ) : (
                  <br />
                )}

                <StButtonSet>
                  <SignUpButton
                    type="submit"
                    color="navy"
                    size="small"
                    disabled={checkName && checkEmail && checkPassword && checkConfirmPassword ? false : true}
                  >
                    회원가입
                  </SignUpButton>
                  <Button color="navy" size="small" onClick={closeHandler}>
                    닫기
                  </Button>
                </StButtonSet>
              </Inner>
            </Outer>,
            document.getElementById(PORTAL_MODAL)
          )
        : null}
    </>
  );
};

export default SignUpModal;

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
