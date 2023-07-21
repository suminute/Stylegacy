import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getLikedStoresByUser } from '../api/likes';
import { useDispatch, useSelector } from 'react-redux';
import ProfileModal from '../components/myPage/ProfileModal';
import { getCurrentUser } from '../api/users';
import PasswordModal from '../components/myPage/PasswordModal';
import ProfileAvatar from './../components/myPage/ProfileAvatar';
import { togglePasswordModal, toggleProfileModal } from '../redux/modules/modalSlice';

const MyPage = () => {
  const { userName, userEmail } = useSelector(({ user }) => user.user);

  const modals = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  const user = useQuery({ queryKey: ['myPage'], queryFn: getCurrentUser });
  const likedStores = useQuery({ queryKey: ['likedStores'], queryFn: getLikedStoresByUser });
  console.log('likedStores.data', likedStores.data);
  if (user.isLoading) {
    return <span>Loading...</span>;
  }
  if (user.isError) {
    return <span>Error: {user.error.message}</span>;
  }

  return (
    <Container>
      <ProfileContainer>
        <Profile>
          <ProfileImageContainer>
            <ProfileAvatar width="150" height="150" src={user.data.userImage} />
          </ProfileImageContainer>
          <ProfileInfoContainer>
            <p>{userName}님, 안녕하세요!</p>
            <p>{userEmail}</p>
          </ProfileInfoContainer>
        </Profile>
        <div>
          <ProfileUpdateButton onClick={() => dispatch(toggleProfileModal())}>프로필 수정</ProfileUpdateButton>
          {modals.isProfileModalOpen && (
            <ProfileModal isOpen={modals.isProfileModalOpen} setIsOpen={() => dispatch(toggleProfileModal())} />
          )}
          <ProfileUpdateButton onClick={() => dispatch(togglePasswordModal())}>비밀번호 수정</ProfileUpdateButton>
          {modals.isPasswordModalOpen && (
            <PasswordModal isOpen={modals.isPasswordModalOpen} setIsOpen={() => dispatch(togglePasswordModal())} />
          )}
        </div>
      </ProfileContainer>
      <MyLikeTitleContainer>
        <MyLikeTitle>내가 찜한 가게</MyLikeTitle>
        <MyLikeLink>더보기</MyLikeLink>
      </MyLikeTitleContainer>
      <MyLikeListContainer>
        {!likedStores.isLoading && likedStores.data.map((store) => <LikedStoreCard key={store.id} store={store} />)}
      </MyLikeListContainer>
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  padding: 65px 100px;
  display: flex;
  flex-direction: column;
  gap: 70px;
`;
const ProfileContainer = styled.div`
  background-color: var(--color_pink3);
  padding: 70px;
  border-radius: 0.625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
  div {
    display: flex;
    gap: 5px;
  }
`;

const Profile = styled.div`
  display: flex;
  gap: 2rem;
`;

const ProfileImageContainer = styled.div`
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 1.5rem;
`;

const ProfileUpdateButton = styled.button`
  background-color: #d9d9d9;
  padding: 2rem 4rem;
  border-radius: 0.625rem;
  display: inline-block;
  font-size: 1.75rem;
`;

const MyLikeTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MyLikeTitle = styled.h3`
  font-size: 2.25rem;
`;

const MyLikeLink = styled(Link)`
  font-size: 1.75rem;
`;

const MyLikeListContainer = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  row-gap: 2rem;
  column-gap: 1rem;
  margin-bottom: 50px;
  padding-top: 60px;
  border-top: 1px solid var(--color_gray2);
`;

const MyLikeCard = styled.div`
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 0.625rem;
  overflow: hidden;
  width: 500px;
  background-color: var(--color_pink3);
  border: 1px solid var(--color_pink3);
`;

const MyLikeCardImageContainer = styled.div`
  border-radius: 0.625rem;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
`;

const MyLikeCardImage = styled.img`
  object-fit: cover;
  width: 100%;
`;

const MyLikeCardInfo = styled.div`
  font-size: 1.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  line-height: 1.2;
`;

const LikedStoreCard = ({ store }) => {
  return (
    <MyLikeCard>
      <Link to={`/store/${store.id}`}>
        <MyLikeCardImageContainer>
          <MyLikeCardImage src={store.image} alt="store" width="500" height="300" />
        </MyLikeCardImageContainer>
        <MyLikeCardInfo>
          <p>{store.store}</p>
          <CardInfoText>{store.location}</CardInfoText>
        </MyLikeCardInfo>
      </Link>
    </MyLikeCard>
  );
};

const CardInfoText = styled.p`
  font-weight: 300;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
  white-space: break-spaces;
`;
