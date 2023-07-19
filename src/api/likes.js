import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

// 각 user의 좋아요 클릭 여부 handle
export const getLikes = async (storeId) => {
  const likesQuery = query(collection(db, 'likes'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  return querySnapshot.docs.map((doc) => doc.data().userId);
};

export const addLike = async ({ userId, storeId }) => {
  await setDoc(doc(collection(db, 'likes')), { userId, storeId });
};

export const removeLike = async ({ userId, storeId }) => {
  const likesQuery = query(collection(db, 'likes'), where('userId', '==', userId), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  if (!querySnapshot.empty) {
    const likeDoc = querySnapshot.docs[0];
    await deleteDoc(likeDoc.ref);
  }
};

// 전체 좋아요 수 카운트
export const increaseLikeCount = async (storeId) => {
  const postRef = doc(db, 'stores', storeId);
  const postSnap = await getDoc(postRef);
  const currentCount = postSnap.data().likeCount;
  await updateDoc(postRef, {
    likeCount: currentCount + 1
  });
};

export const decreaseLikeCount = async (storeId) => {
  const postRef = doc(db, 'stores', storeId);
  const postSnap = await getDoc(postRef);
  const currentCount = postSnap.data().likeCount;
  await updateDoc(postRef, {
    likeCount: currentCount - 1
  });
};

// 게시글 삭제 시, 해당 게시글이 가진 좋아요 문서 모두 삭제
export const removeAllLike = async (storeId) => {
  const likesQuery = query(collection(db, 'likes'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};
