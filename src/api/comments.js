import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@firebase/firestore';
import { auth, db } from '../firebase';

export const getStoreComments = async (storeId) => {
  const q = query(collection(db, 'comments'), where('storeId', '==', storeId));
  const commentsSnap = await getDocs(q);
  const commentsList = [];
  commentsSnap.forEach((doc) => {
    commentsList.push({ id: doc.id, ...doc.data() });
  });
  const userNameList = {};

  for (const comment of commentsList) {
    if (userNameList[comment.userId]) continue;
    const userQuery = query(collection(db, 'users'), where('userId', '==', comment.userId));
    const userSnap = await getDocs(userQuery);
    const docData = userSnap.docs[0].data();
    userNameList[docData.userId] = { userName: docData.userName, userImage: docData.userImage };
  }
  const nameAddedCommentList = commentsList.map((comment) => ({ ...comment, ...userNameList[comment.userId] }));
  return nameAddedCommentList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateComment = async ({ id, content }) => {
  // 유저 확인
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  // 댓글 확인
  const docRef = doc(db, 'comments', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap?.exists()) throw new Error('댓글을 찾을 수 없습니다');
  const docData = { ...docSnap.data(), id: docSnap.id };
  // 권한 확인
  if (uid !== docData.userId) throw new Error('삭제 권한이 없습니다');
  // 댓글 업데이트
  await updateDoc(docRef, {
    content
    // createdAt: new Date().toISOString()
  });
};

export const deleteComment = async (id) => {
  // 유저 확인
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  // 댓글 확인
  const docRef = doc(db, 'comments', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap?.exists()) throw new Error('댓글을 찾을 수 없습니다');
  const docData = { ...docSnap.data(), id: docSnap.id };
  // 권한 확인
  if (uid !== docData.userId) throw new Error('삭제 권한이 없습니다');
  // 댓글 삭제
  await deleteDoc(docRef);
};

export const addComment = async ({ storeId, content }) => {
  // 유저 확인
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  // 스토어 확인
  const storeDocRef = doc(db, 'stores', storeId);
  const storeDocSnap = await getDoc(storeDocRef);
  if (!storeDocSnap?.exists()) throw new Error('가게를 찾을 수 없습니다');
  // 댓글 생성
  await addDoc(collection(db, 'comments'), {
    userId: uid,
    storeId,
    content,
    createdAt: new Date().toISOString()
  });
};
