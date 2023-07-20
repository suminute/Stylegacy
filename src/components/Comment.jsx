import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../api/comments';
import IconButton from './IconButton';
import styled from 'styled-components';
import { Pencil, Trash } from '@phosphor-icons/react';
import InputText from './InputText';
import Button from './Button';
import ProfileAvatar from './ProfileAvatar';

const Comment = ({comment}) => {
  console.log(comment)
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
      <StCommentUserContent>
        <ProfileAvatar width='30' height='30' src={comment.userImage}/>
        <StCommentName>{comment.userName}</StCommentName>
      </StCommentUserContent>
      <div>
        <StCommentDate>{formatDate(comment.createdAt)}</StCommentDate>
        {comment.userId === user.userId &&
        (<>
        <IconButton onClick={()=>handleUpdateStart()} label='댓글 수정' type='button' icon={<Pencil/>} weight='bold' size={24} color='#777777' />
        <IconButton onClick={()=>handleDeleteComment(comment.id)} label='댓글 삭제' type='button' icon={<Trash/>} weight='bold' size={24} color='#777777'/>
        </>)}
      </div>
    </StCommentInner>
    {isUpdating ? (
    <StCommentUpdateForm onSubmit={handleUpdateComment}>
      <InputText full size='small' type="text" name="commentUpdate" id="commentUpdate" value={inputComment} onChange={(e)=>setInputComment(e.target.value)}/>
      <Button type='submit' size='medium' color='pink1'>완료</Button>
      <Button type='button' onClick={handleUpdateCancel} size='medium' color='pink2'>취소</Button>
    </StCommentUpdateForm>
    ):(
    <StCommentContent>{comment.content}</StCommentContent>
    )} 
  </StComment>)
}

export default Comment

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
  margin-right: 1rem;
`;

const StCommentDate = styled.span`
  color: var(--color_gray);
`;

const StCommentUpdateForm = styled.form`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`

const StCommentUserContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const StCommentContent = styled.p`
  color: var(--color_gray);
  word-break: break-all;
`;
