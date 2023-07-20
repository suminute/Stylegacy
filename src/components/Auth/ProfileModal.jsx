import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';
import Button from '../Button';
import { getUsers, uploadProfileImage, updateUser } from '../../api/users';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ProfileAvatar from '../ProfileAvatar';
import { changeUser } from '../../redux/modules/userSlice';
import { apiKey, auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';

export const PORTAL_MODAL = 'portal-root';

const ProfileModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  // 로그인한 userId
  const { user } = useSelector((state) => state.user);
  const data = user;
  const userId = user.userId;

  // DB의 users 컬렉션에서 모든 user 정보 가져와서 -> 로그인한 userId에 해당하는 값만 담기
  const { isLoading, error, data: allUsers } = useQuery(['users'], getUsers);
  const userData = allUsers?.find((user) => user.userId === userId);

  const [name, setName] = useState(data?.userName ?? '');
  const [checkName, setCheckName] = useState('');

  const [profileImage, setProfileImage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isResetProfileImage, setResetProfileImage] = useState(false);
  const inputImageRef = useRef(null);

  // 이름 정규표현식 필터
  const nameRegEx = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{2,16}$/;
  const nameCheck = (name) => {
    setCheckName(nameRegEx.test(name));
  };

  // 수정 모달 처음 열렸을 때, 초기 사용자 이름이 유효한지 확인
  useEffect(() => {
    nameCheck(data?.userName);
  }, []);

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
      // DB에 userName 업데이트
      await updateUser(userData?.id, name);

      // 회원가입 시 firebase에 저장한 displayName도 변경
      await updateProfile(auth.currentUser, { displayName: name });

      // userSlice에 userName 업데이트
      dispatch(changeUser(name));
      if (data?.userName !== name) {
        alert('이름이 성공적으로 변경되었습니다.');
      }
      // 로그인 세션을 유지하는 세션 스토리지에서도 정보 변경 필요
      const sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
      let sessionUserData = JSON.parse(sessionStorage.getItem(sessionKey));
      sessionUserData.displayName = name;
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionUserData));

      setIsOpen(false);
    } catch (error) {
      console.log('프로필 수정 에러', error);
    }
  };

  const handleUploadImage = async (e) => {
    const fileTypes = ['image/jpeg', 'image/png'];
    const file = e.target.files[0];
    if (!file) return;
    const { type, size } = file;
    if (size > 5 * 1048576) return alert('5MB 이하의 이미지를 선택해주세요.');
    if (!fileTypes.includes(type)) return alert('지원하지 않는 파일 형식입니다. 지원 형식: jpeg, png');
    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file));
    setResetProfileImage(false);
    const url = await uploadProfileImage({ userId, file });
    console.log(url);
  };

  const handleDeleteImage = (e) => {
    setResetProfileImage(true);
    setProfileImageFile(null);
    setProfileImage('');
  };

  // if(isResetProfileImage) image = ''
  // else if(profileImageFile) image = await uploadProfileImage(profileImage)

  useEffect(() => {
    console.log('change data', data);
    if (data?.userImage) {
      console.log('userImage', data.userImage);
      setProfileImage(data.userImage);
    }
  }, [data]);

  useEffect(() => {
    console.log('profileImage', profileImage);
  }, [profileImage]);

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
          <Inner onClick={stopPropagation} onSubmit={handleSubmit}>
            <p>프로필을 수정해볼까요?</p>
            <ProfileAvatarButton type="button" onClick={() => inputImageRef.current.click()}>
              <ProfileAvatar width="100" height="100" src={profileImage} />
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
                변경
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
              placeholder={data?.userName}
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
