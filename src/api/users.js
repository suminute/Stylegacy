import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

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
