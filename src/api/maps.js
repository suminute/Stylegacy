import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
const updateStore = async ({ id, modifiedStore }) => {
  const storeRef = doc(db, 'stores', id);
  await updateDoc(storeRef, { ...modifiedStore });
};

// 삭제
const deleteStore = async (id) => {
  const storeRef = doc(db, 'stores', id);
  await deleteDoc(storeRef);
};

// storage 추가
const storageUpload = async ({ id, selectedFile }) => {
  if (selectedFile) {
    const imageRef = ref(storage, `${id}/${selectedFile.name}`);
    await uploadBytes(imageRef, selectedFile);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } else {
    return false;
  }
};

export { getStores, addStore, deleteStore, updateStore, storageUpload };
