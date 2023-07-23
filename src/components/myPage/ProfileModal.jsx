import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';
import Button from '../shared/Button';
import { uploadProfileImage, updateUser, getCurrentUser } from '../../api/users';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ProfileAvatar from './ProfileAvatar';
import { changeUser } from '../../redux/modules/userSlice';
import { apiKey, auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { setAlertMessage, toggleAlertModal } from '../../redux/modules/modalSlice';
import AlertModal from '../shared/AlertModal';

export const PORTAL_MODAL = 'portal-root';

const ProfileModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const mutationUpdateUser = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPage'] });
      dispatch(changeUser(name));

      if (data?.userName !== name) {
        dispatch(setAlertMessage('이름이 성공적으로 변경되었습니다.'));
        dispatch(toggleAlertModal());
      }

      setIsOpen(false);
    },
    onError: (error) => {
      dispatch(setAlertMessage(error.message));
      dispatch(toggleAlertModal());
    }
  });

  // redux store에서 모달 상태 관리
  const modals = useSelector((state) => state.modals);

  // 로그인한 userId
  const { user } = useSelector((state) => state.user);
  const userData = user;

  // DB의 users 컬렉션에서 모든 user 정보 가져와서 -> 로그인한 userId에 해당하는 값만 담기
  const { isLoading, error, data } = useQuery(['users'], getCurrentUser);

  const [name, setName] = useState(userData?.userName ?? '');
  const [checkName, setCheckName] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isResetProfileImage, setResetProfileImage] = useState(false);
  const inputImageRef = useRef(null);

  // 이름 정규표현식 필터
  const nameCheck = useCallback((name) => {
    const nameRegEx = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{2,16}$/;
    setCheckName(nameRegEx.test(name));
  }, []);

  // 수정 모달 처음 열렸을 때, 초기 사용자 이름이 유효한지 확인
  useEffect(() => {
    nameCheck(userData?.userName);
  }, [userData?.userName, nameCheck]);

  // input 관리
  const nameController = (e) => {
    setName(e.target.value);
    if (e.target.value !== data?.userName) {
      nameCheck(e.target.value);
    }
  };

  // 수정 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {};
      if (name !== userData?.userName) {
        updatedUser.userName = name;
      }
      if (isResetProfileImage) updatedUser.userImage = '';
      else if (profileImageFile) updatedUser.userImage = await uploadProfileImage(profileImageFile);
      // DB 업데이트
      mutationUpdateUser.mutate(updatedUser);

      // 회원가입 시 firebase auth에 저장한 displayName도 변경
      await updateProfile(auth.currentUser, { displayName: name });

      // 로그인 세션을 유지하는 세션 스토리지에서도 정보 변경 필요
      const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
      let sessionUserData = JSON.parse(sessionStorage.getItem(sessionKey));
      sessionUserData.displayName = name;
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionUserData));
    } catch (error) {
      console.log('프로필 수정 에러', error);
    }
  };

  const handleUploadImage = async (e) => {
    const fileTypes = ['image/jpeg', 'image/png'];
    const file = e.target.files[0];
    if (!file) return;
    const { type, size } = file;
    if (size > 5 * 1048576) {
      dispatch(setAlertMessage('5MB 이하의 이미지를 선택해주세요.'));
      dispatch(toggleAlertModal());
    }
    // if (!fileTypes.includes(type)) return alert('지원하지 않는 파일 형식입니다. 지원 형식: jpeg, png');
    if (!fileTypes.includes(type)) {
      dispatch(setAlertMessage('지원하지 않는 파일 형식입니다. 지원 형식: jpeg, png'));
      dispatch(toggleAlertModal());
    }
    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file));
    setResetProfileImage(false);
  };

  const handleDeleteImage = (e) => {
    setResetProfileImage(true);
    setProfileImageFile(null);
    setProfileImage('');
  };

  // 수정 모달창 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isLoading && data.userImage) setProfileImage(data.userImage);
  }, [isLoading, data]);

  if (isLoading) return null;
  if (error) return null;

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
              <Inner onClick={stopPropagation} onSubmit={handleSubmit}>
                <p>프로필을 수정해볼까요?</p>
                <ProfileAvatarButton type="button" onClick={() => inputImageRef.current.click()}>
                  <ProfileAvatar width="100" height="100" src={profileImage || data.profileImage} />
                  <ProfileAvatarButtonText>변경</ProfileAvatarButtonText>
                </ProfileAvatarButton>
                <input
                  ref={inputImageRef}
                  onChange={handleUploadImage}
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  hidden
                />
                <StButtonSet>
                  <Button color="navy" size="small" type="button" onClick={() => inputImageRef.current.click()}>
                    선택
                  </Button>
                  <Button color="pink3" size="small" type="button" onClick={handleDeleteImage}>
                    삭제
                  </Button>
                </StButtonSet>
                <Input
                  type="text"
                  name="name"
                  value={name}
                  onChange={nameController}
                  placeholder={userData?.userName}
                  autoFocus
                />
                {checkName === true ? (
                  <StP style={{ color: 'var(--color_black)' }}>사용 가능한 이름입니다.</StP>
                ) : name ? (
                  <StP>2자 이상 16자 내 영어, 한글로 구성해주세요.</StP>
                ) : (
                  <br />
                )}

                <Input type="email" name="email" value={data?.userEmail} disabled />
                <br />

                <StButtonSet>
                  <SignUpButton type="submit" color="navy" size="small" disabled={!checkName}>
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
        : null}
    </>
  );
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

const ProfileAvatarButton = styled.button`
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 0;
  border: none;
  border-radius: 50%;
`;
const ProfileAvatarButtonText = styled.p`
  height: 100%;
  width: 100%;
  color: transparent;
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  transition: all 200ms ease-in-out;
  &:hover {
    color: white;
    background-color: rgb(0 0 0 / 46%);
  }
`;
