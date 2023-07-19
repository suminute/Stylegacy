import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import Button from '../Button';
import { useMutation, useQueryClient } from 'react-query';
import { addStore, updateStore } from '../../api/maps';
import useInput from '../../hooks/useInput';

const StoreUpdateModal = ({ type, closeModal, id, post }) => {
  const [disabled, setDisabled] = useState(true);
  const [store, storeHandler, setStore] = useInput('');
  const [time, timeHandler, setTime] = useInput('');
  const [location, locationHandler, setLocation] = useInput('');

  useEffect(() => {
    if (type === 'add') {
      setStore('');
      setTime('');
      setLocation('');
    } else if (type === 'update') {
      setStore(post.store);
      setTime(post.time);
      setLocation(post.location);
    }
  }, []);

  useEffect(() => {
    if (location && store) {
      setDisabled(false);
    } else if (location == null) {
      setDisabled(true);
    }
  }, [location]);

  let newStore = {};

  if (type === 'add') {
    newStore = {
      store,
      time,
      location,
      likeCount: 0
    };
  } else if (type === 'update') {
    newStore = {
      store,
      time,
      location,
      likeCount: post.likeCount
    };
  }

  // 쿼리
  const queryClient = useQueryClient();
  const addMutation = useMutation(addStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });
  const updateMutation = useMutation(updateStore, {
    onSuccess: () => {
      queryClient.invalidateQueries('stores');
    }
  });

  // 저장 버튼과 수정 버튼
  const addButtonHandler = (e) => {
    e.preventDefault();
    addMutation.mutate(newStore);
    closeModal();
  };
  const updateButtonHandler = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id, newStore });
    closeModal();
  };

  return (
    <StBackground>
      <Stdiv>
        <Button color="pink3" size="medium" onClick={closeModal}>
          X
        </Button>
      </Stdiv>
      <form>
        <div>
          <label>가게 이름</label>
          <input value={store} onChange={storeHandler} />
        </div>
        <div>
          <label>영업시간</label>
          <input value={time} onChange={timeHandler} />
        </div>
        <div>
          <label>상세주소</label>
          <input value={location} onChange={locationHandler} />
        </div>
        <div>
          {type === 'add' && (
            <Button type="submit" color="pink2" size="medium" disabled={disabled} onClick={addButtonHandler}>
              저장
            </Button>
          )}
          {type === 'update' && (
            <Button type="submit" color="pink2" size="medium" disabled={disabled} onClick={updateButtonHandler}>
              수정
            </Button>
          )}
        </div>
      </form>
    </StBackground>
  );
};

export default StoreUpdateModal;

const Stdiv = styled.div`
  position: absolute;
  right: 1.5rem;
`;

const StBackground = styled.div`
  position: fixed;
  top: 59px;
  left: 0;
  width: 450px;
  height: 94vh;
  background-color: var(--color_pink3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
