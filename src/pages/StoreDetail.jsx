import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import InputText from '../components/shared/InputText';
import useInput from '../hooks/useInput';
import { addComment, getStoreComments } from '../api/comments';
import Comment from '../components/detailPage/Comment';
import DeleteUpdateButton from '../components/map/DeleteUpdateButton';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreUpdateModal from '../components/map/StoreUpdateModal';
import { deleteStore } from '../api/stores';
import { removeAllLike } from '../api/likes';
import Button from './../components/shared/Button';
import StaticMap from './../components/detailPage/StaticMap';
import { setAlertMessage, toggleAlertModal } from '../redux/modules/modalSlice';
import AlertModal from '../components/shared/AlertModal';

const StoreDetail = () => {
  const [inputComment, handleInputComment, setInputComment] = useInput('');
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(['storeDetail', id], () => getStoreData(id));
  const { isLoading: isLoadingComment, data: dataComment } = useQuery(['storeDetailComment', id], () =>
    getStoreComments(id)
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const userId = user.userId;
  const modals = useSelector((state) => state.modals);

  const [isOpen, setIsOpen] = useState(false);

  const openUpdateModal = () => {
    setIsOpen(true);
  };
  const closeUpdateModal = () => {
    setIsOpen(false);
  };
  // 게시글 삭제 버튼
  const deleteMutation = useMutation(deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });
  const removeAllLikeMutation = useMutation(removeAllLike, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes'], data.id);
    }
  });
  const deleteOnClickHandler = (id) => {
    const deleteConf = window.confirm('정말 삭제하시겠습니까?');
    if (deleteConf) {
      deleteMutation.mutate(id);
      removeAllLikeMutation.mutate(data.id);
      dispatch(setAlertMessage('삭제되었습니다!'));
      dispatch(toggleAlertModal());
      navigate('/search');
    }
  };

  const mutationAddComment = useMutation(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeDetailComment'] });
      setInputComment('');
    },
    onError: (error) => {
      dispatch(setAlertMessage(error.message));
      dispatch(toggleAlertModal());
    }
  });

  const getStoreData = async (id) => {
    const docSnap = await getDoc(doc(db, 'stores', id));
    if (docSnap?.exists()) return { ...docSnap.data(), id: docSnap.id };
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!inputComment) return;
    mutationAddComment.mutate({ storeId: id, content: inputComment });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <>
      {modals.isAlertModalOpen && (
        <AlertModal
          message={modals.alertMessage}
          isOpen={modals.isAlertModalOpen}
          setIsOpen={() => dispatch(toggleAlertModal())}
        />
      )}
      <StContainer>
        <StBox>
          <StStore>
            <StStoreCol>
              <StoreImage src={data.image} alt={data.store} width="500" height="625" />
              <StoreButton to={data.site || '#'}>{data.site ? '웹 사이트' : '웹 사이트가 없습니다'}</StoreButton>
            </StStoreCol>
            <StStoreCol>
              <StStoreInfo>
                <StStoreTitle>
                  {data.store}
                  {userId && (
                    <StDelUpButton>
                      <DeleteUpdateButton
                        openUpdateModal={openUpdateModal}
                        deleteOnClickHandler={deleteOnClickHandler}
                        postId={data.id}
                      ></DeleteUpdateButton>
                      {isOpen && (
                        <StoreUpdateModal
                          type="update"
                          closeUpdateModal={closeUpdateModal}
                          id={data.id}
                          post={data}
                        ></StoreUpdateModal>
                      )}
                    </StDelUpButton>
                  )}
                </StStoreTitle>
                <div>
                  <StStoreInfoLabel>영업일</StStoreInfoLabel>
                  <StStoreInfoContent>{data.day}</StStoreInfoContent>
                </div>
                <div>
                  <StStoreInfoLabel>영업시간</StStoreInfoLabel>
                  <StStoreInfoContent>{data.time}</StStoreInfoContent>
                </div>
                <div>
                  <StStoreInfoLabel>전화번호</StStoreInfoLabel>
                  <StStoreInfoContent>{data.phoneNumber}</StStoreInfoContent>
                </div>
              </StStoreInfo>
              <div>
                <StStoreInfoLabel>지도보기</StStoreInfoLabel>
                <Link to={`https://map.kakao.com/link/search/${data.store}`}>
                  <StaticMap lng={data.marker.x} lat={data.marker.y} title={data.location} />
                </Link>
              </div>
            </StStoreCol>
          </StStore>
          <StDivider />
          <StCommentsTitle>
            댓글<StCommentsCount>{dataComment?.length || 0}</StCommentsCount>
          </StCommentsTitle>
          <StCommentsList>
            <form onSubmit={handleAddComment}>
              <StCommentFormInner>
                <InputText
                  placeholder="댓글을 입력하세요."
                  full
                  size="small"
                  type="text"
                  name="comment"
                  id="comment"
                  value={inputComment}
                  onChange={handleInputComment}
                />
                <Button size="large" color="pink1">
                  작성
                </Button>
              </StCommentFormInner>
            </form>
            {!isLoadingComment && dataComment.map((comment) => <Comment key={comment.id} comment={comment} />)}
          </StCommentsList>
        </StBox>
      </StContainer>
    </>
  );
};

export default StoreDetail;

const StBox = styled.div`
  max-width: 1300px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StCommentsList = styled.ul`
  box-sizing: border-box;
  background-color: var(--color_pink3);
  padding: 3rem;
  border-radius: 10px;
  /* width: 1100px; */
  width: 100%;
  max-width: 1100px;
`;

const StCommentsTitle = styled.h3`
  font-size: 2.25rem;
  text-align: left;
  margin: 2rem 0;
`;

const StCommentsCount = styled.span`
  color: var(--color_pink1);
  margin-left: 0.75rem;
  font-weight: 900;
`;

const StoreButton = styled(Link)`
  text-align: center;
  padding: 0.6em;
  font-size: 1.5rem;
  border-radius: 0.625rem;
  background-color: var(--color_white);
  border: 6px solid var(--color_pink3);
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
`;

const StContainer = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StStore = styled.div`
  display: flex;
  gap: 4rem;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StStoreCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.25rem;
`;

const StStoreTitle = styled.h2`
  margin: 2rem 0;
  font-size: 2rem;
  display: flex;
  justify-content: space-between;
`;

const StStoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StStoreInfoLabel = styled.h4`
  color: var(--color_gray);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const StStoreInfoContent = styled.p`
  font-size: 1.25rem;
`;

const StoreImage = styled.img`
  border-radius: 10px;
  object-fit: cover;
  box-shadow: rgb(50 50 93 / 37%) 0px 6px 12px -2px, rgb(0 0 0 / 42%) 0px 3px 7px -3px;
`;

const StDivider = styled.div`
  width: 100%;
  margin: 4rem 0;
  height: 2px;
  background-color: #d48888;
`;

const StCommentFormInner = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StDelUpButton = styled.div`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
