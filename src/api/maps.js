import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// 데이터 조회
const getStores = async () => {
  const q = query(collection(db, 'stores'));
  const querySnapshot = await getDocs(q);
  const initialMaps = [];
  querySnapshot.forEach((doc) => {
    initialMaps.push({ id: doc.id, ...doc.data() });
  });
  return initialMaps;
};

// 추가
const addStore = async (newStore) => {
  const collectionRef = collection(db, 'stores');
  await addDoc(collectionRef, newStore);
};

// 수정
const updateStore = async ({ id, newStore }) => {
  const storeRef = doc(db, 'stores', id);
  await updateDoc(storeRef, { ...newStore });
};

// 삭제
const deleteStore = async (id) => {
  const storeRef = doc(db, 'stores', id);
  await deleteDoc(storeRef);
};

export { getStores, addStore, deleteStore, updateStore };
