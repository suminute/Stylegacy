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
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// 각 user의 좋아요 클릭 여부 handle
export const getLikes = async (storeId) => {
  const likesQuery = query(collection(db, 'likes'), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  return querySnapshot.docs.map((doc) => doc.data().userId);
};

// 좋아요 클릭 시 count +1
export const addLike = async ({ userId, storeId }) => {
  const likesQuery = query(collection(db, 'likes'), where('userId', '==', userId), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  if (querySnapshot.empty) {
    const likeRef = doc(collection(db, 'likes'));
    const postRef = doc(db, 'stores', storeId);

    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      const currentCount = postSnap.data().likeCount;
      transaction.update(postRef, { likeCount: currentCount + 1 });
      await transaction.set(likeRef, { userId, storeId });
    });
  }
};

// 좋아요 취소 시 count -1
export const removeLike = async ({ userId, storeId }) => {
  const likesQuery = query(collection(db, 'likes'), where('userId', '==', userId), where('storeId', '==', storeId));
  const querySnapshot = await getDocs(likesQuery);
  if (!querySnapshot.empty) {
    const likeDoc = querySnapshot.docs[0];
    const postRef = doc(db, 'stores', storeId);

    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      const currentCount = postSnap.data().likeCount;
      transaction.update(postRef, { likeCount: currentCount - 1 });
      await transaction.delete(likeDoc.ref);
    });
  }
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

export const getLikedStoresByUser = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  const q = query(collection(db, 'likes'), where('userId', '==', uid));

  const querySnapshot = await getDocs(q);
  const storesList = [];
  querySnapshot.forEach((document) => {
    const { storeId } = document.data();
    storesList.push(storeId);
  });
  const results = [];
  for (const storeId of storesList) {
    const storeSnap = await getDoc(doc(db, 'stores', storeId));
    if (storeSnap.exists())
      results.push({
        id: storeSnap.id,
        ...storeSnap.data()
      });
  }

  return results;
};
