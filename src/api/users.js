import { addDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import shortid from 'shortid';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';

// user 데이터 조회
export const getUsers = async () => {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);
  const initialMaps = [];
  querySnapshot.forEach((doc) => {
    initialMaps.push({ id: doc.id, ...doc.data() });
  });
  return initialMaps;
};

// 회원가입 시 user 데이터 추가
export const addUser = async (newUser) => {
  const collectionRef = collection(db, 'users');
  await addDoc(collectionRef, newUser);
};

export const uploadProfileImage = async (file) => {
  // uid 가져오기
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  const fileName = shortid.generate(); // random file name
  const storageRef = ref(storage, `user/${uid}/profile/${fileName}`);
  const uploadedSnap = await uploadBytes(storageRef, file);
  return await getDownloadURL(uploadedSnap.ref);
};

export const getDefaultProfileImageUrl = async () => {
  return await getDownloadURL(ref(storage, 'asset/images/default-profile-image.png'));
};

export const getCurrentUser = async () => {
  // uid 가져오기
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  // 유저 데이터 가져오기
  const userQuery = query(collection(db, 'users'), where('userId', '==', uid));
  const userSnap = await getDocs(userQuery);
  const userDoc = userSnap.docs[0];
  if (!userDoc?.exists()) throw new Error('유저를 찾을 수 없습니다');
  const userData = { id: userDoc.id, ...userDoc.data() };
  return userData;
};

// 프로필 수정 시 user 데이터 변경
export const updateUser = async (updatedUser) => {
  // uid 가져오기
  const user = auth.currentUser;
  if (!user) throw new Error('로그인 상태가 아닙니다');
  const { uid } = user;
  // 유저 데이터 가져오기
  const userQuery = query(collection(db, 'users'), where('userId', '==', uid));
  const userSnap = await getDocs(userQuery);
  const userDoc = userSnap.docs[0];
  if (!userDoc?.exists()) throw new Error('유저를 찾을 수 없습니다');
  const userRef = userDoc.ref;
  await updateDoc(userRef, updatedUser);
};
