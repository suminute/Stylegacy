import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

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
    console.log(storeSnap);
    if (storeSnap.exists())
      results.push({
        id: storeSnap.id,
        ...storeSnap.data()
      });
  }

  return results;
};
