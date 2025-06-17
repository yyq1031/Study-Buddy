const getDoc = async (db, uid, collectionName) => {
  const userDocRef = db.collection(collectionName).doc(uid);
  const userDoc = await userDocRef.get();
  if (!userDoc.exists) throw new Error(`${collectionName} not found`);
  return { data: userDoc.data(), ref: userDocRef };
};

module.exports = { getDoc };