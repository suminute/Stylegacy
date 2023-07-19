import { doc, getDoc  } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import InputText from '../components/InputText';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { addComment, deleteComment, getStoreComments, updateComment } from '../api/comments';
import IconButton from '../components/IconButton';
import { Pencil, Trash } from '@phosphor-icons/react';
const StoreDetail = () => {
  const [inputComment,setInputComment] = useInput('')
  const { id } = useParams();
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery(['storeDetail', id], () => getStoreData(id));
  const { isLoading: isLoadingComment, error: errorComment, data: dataComment } = useQuery(['storeDetailComment', id], () => getStoreComments(id));
  
  const mutationAddComment = useMutation(addComment,{
    onSuccess: () => queryClient.invalidateQueries({queryKey:['storeDetailComment']}),
    onError: (error) => { alert(error.message)},
  })


  const getStoreData = async (id) => {
    const docSnap = await getDoc(doc(db, 'stores', id));
    if (docSnap?.exists()) return { ...docSnap.data(), id: docSnap.id };
  };

  const user = useSelector(({user}) => user.user);
  // const data = {
  //   id: 'lGBXdJibgGduq4GDvjS8',
  //   site: 'https://www.instagram.com/tonywack_readytowear',
  //   phoneNumber: '070-7765-5578',
  //   marker: {
  //     x: 127.005920167659,
  //     y: 37.5377214021121
  //   },
  //   image:
  //     'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220815_97%2F166056034235103u8W_JPEG%2F45553d3b7e8e7d2e2dacfceb2c62a5da.jpg',
  //   store: '토니웩 한남',
  //   time: '12:00-20:30',
  //   location: '서울 용산구 한남대로28가길 19',
  //   like: 0
  // };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if(!inputComment) return
    mutationAddComment.mutate({ storeId: id, content: inputComment })
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <StContainer>
      <StStore>
        <StStoreCol>
          <StoreImage src={data.image} alt={data.store} width="500" height="625" />
          <StoreButton to={data.site || '#'}>{data.site ? '웹 사이트': '웹 사이트가 없습니다'}</StoreButton>
        </StStoreCol>
        <StStoreCol>
          <StStoreInfo>
            <StStoreTitle>{data.store}</StStoreTitle>
            <div>
              <StStoreInfoLabel>영업시간</StStoreInfoLabel>
              <StStoreInfoContent>{data.time}</StStoreInfoContent>
            </div>
            <div>
              <StStoreInfoLabel>전화번호</StStoreInfoLabel>
              <StStoreInfoContent>{data.phoneNumber}</StStoreInfoContent>
            </div>
          </StStoreInfo>
          <Link to={`https://map.kakao.com/link/search/${data.store}`}>
          <StaticMap lng={data.marker.x} lat={data.marker.y} title={data.location} />
          </Link>
          
        </StStoreCol>
      </StStore>
      <StDivider />
      <StCommentsContainer>
        <StCommentsTitle>
          댓글<StCommentsCount>{dataComment?.length || 0 }</StCommentsCount>
        </StCommentsTitle>
        <StCommentsList>
          <form onSubmit={handleAddComment}>
            <StCommentFormInner>
            <InputText placeholder='댓글을 입력하세요.' full size='small' type="text" name="comment" id="comment" value={inputComment} onChange={setInputComment}/>
            <Button size='large' color='pink1'>작성</Button>
            </StCommentFormInner>
          </form>
          {!isLoadingComment && dataComment.map((comment)=> (
            <Comment key={comment.id} comment={comment}/>
          ))}
        </StCommentsList>
      </StCommentsContainer>
    </StContainer>
  );
};

export default StoreDetail;

const StCommentsList = styled.ul`
  background-color: var(--color_pink3);
  padding: 3rem;
  border-radius: 10px;
  width: 1100px;
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
  padding: 50px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StStore = styled.div`
  display: flex;
  gap: 4rem;
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

const StCommentsContainer = styled.div``;
const StDivider = styled.div`
  width: 1300px;
  margin: 4rem 0;
  height: 2px;
  background-color: #d48888;
`;

const StCommentFormInner = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const StaticMap = ({ lat, lng, title }) => {
  const mapContainerRef = useRef(null);
  const staticMapRef = useRef(null);
  useEffect(() => {
    window.kakao.maps.load(function () {
      const option = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
        marker: {
          position: new window.kakao.maps.LatLng(lat, lng)
        }
      };
      staticMapRef.current = new window.kakao.maps.StaticMap(mapContainerRef.current, option);
    });
  }, [lat, lng]);

  return (
    <StMapContainer>
      <StMap ref={mapContainerRef}></StMap>
      {title && (
      <StMapTitle>
        <span>{title}</span>
      </StMapTitle>
      )}
    </StMapContainer>
  );
};

const StMapContainer = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  pointer-events: none;
`;

const StMap = styled.div`
  width: 500px;
  height: 300px;
`;
const StMapTitle = styled.div`
  padding: 1rem;
  position: absolute;
  width: 100%;
  font-size: 1.25rem;
  background-color: rgba(0, 0, 0, 0.714);
  bottom: 0;
  color: white;
  display: flex;
  align-items: center;
`;

const Comment = ({comment}) => {
  const [isUpdating,setUpdating] = useState(false)
  const [inputComment,setInputComment] = useState(comment.content)
  const user = useSelector(({user}) => user.user);
  const queryClient = useQueryClient()

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const mutationUpdateComment = useMutation(updateComment,{
    onSuccess: () => {
      setUpdating(false)
      queryClient.invalidateQueries({queryKey:['storeDetailComment']})
    },
    onError: (error) => {
      alert(error.message)
    },
  })
  const mutationDeleteComment = useMutation(deleteComment,{
    onSuccess: () => queryClient.invalidateQueries({queryKey:['storeDetailComment']}),
    onError: (error) => { alert(error.message)},
  })

  const handleDeleteComment = async (id) => {
    if(!id) return
    const confirm =  window.confirm('이 댓글을 삭제하시겠습니까?')
    if(!confirm) return
    mutationDeleteComment.mutate(id)
  }

  const handleUpdateComment = async (e) => {
    e.preventDefault()
    if(!comment.id) return
    mutationUpdateComment.mutate({ id:comment.id, content:inputComment })
  }

  const handleUpdateStart = () => {
    setInputComment(comment.content)
    setUpdating(true)
  }
  const handleUpdateCancel = () => {
    setUpdating(false)  
  }

  return(<StComment>
    <StCommentInner>
      <StCommentName>{comment.userName}</StCommentName>
      <div>
        <StCommentDate>{formatDate(comment.createdAt)}</StCommentDate>
        {comment.userId === user.userId &&
        (<>
        <IconButton onClick={()=>handleUpdateStart()} label='댓글 수정' type='button' icon={<Pencil/>} weight='bold' size={24} color='#777777' />
        <IconButton onClick={()=>handleDeleteComment(comment.id)} label='댓글 삭제' type='button' icon={<Trash/>} weight='bold' size={24} color='#777777'/>
        </>)}
      </div>
    </StCommentInner>
    

    {isUpdating ? (<StCommentUpdateForm onSubmit={handleUpdateComment}>
      <InputText full size='small' type="text" name="commentUpdate" id="commentUpdate" value={inputComment} onChange={(e)=>setInputComment(e.target.value)}/>
      <Button type='submit' size='medium' color='pink1'>완료</Button>
      <Button type='button' onClick={handleUpdateCancel} size='medium' color='pink2'>취소</Button>
    </StCommentUpdateForm>):(<StCommentContent>{comment.content}</StCommentContent>)} 


  </StComment>)
}


const StComment = styled.li`
  font-size: 1.5rem;
  padding: 1rem;
  line-height: 2.5rem;
`;

const StCommentInner = styled.div`
  display: flex;
  justify-content: space-between;
`

const StCommentName = styled.span`
  margin-right: 2rem;
`;

const StCommentContent = styled.p`
  color: var(--color_gray);
  word-break: break-all;
`;
const StCommentDate = styled.span`
  color: var(--color_gray);
`;

const StCommentUpdateForm = styled.form`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`