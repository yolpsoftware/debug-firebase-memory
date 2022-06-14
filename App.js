import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, limit, orderBy, query, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD5pUJserHV-Ip7FxsgOd6cIa6uaLEBYZQ",
  authDomain: "debug-firebase-memory.firebaseapp.com",
  projectId: "debug-firebase-memory",
  storageBucket: "debug-firebase-memory.appspot.com",
  messagingSenderId: "643275739951",
  appId: "1:643275739951:web:141a89fb3d27c10b4947da"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [nOfDocs, setNOfDocs] = React.useState(0);
  const createDocs = async () => {
    const COLLECTION_NAME = 'debug-firestore-memory';
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const CHARS_LEN = CHARS.length;
    const existingDoc = await getDocs(query(collection(db, COLLECTION_NAME), orderBy('index', 'desc'), limit(1)));
    const existingMaxIndex = existingDoc.docs[0].data().index;
    for (let i = existingMaxIndex + 1; i < 1000; i++) {
      const docId = `doc-id-${i.toString().padStart(4, '0')}`;
      const document = doc(collection(db, COLLECTION_NAME), docId);
      const data = {
        id: docId,
        index: i,
      };
      for (let j = 0; j < 100; j++) {
        let str = 'This string is 1000 bytes together with its key: ';
        const bytesSoFar = str.length + 1 + 10;
        for (let k = bytesSoFar; k < 1000; k++) {
          str += CHARS.charAt(Math.floor(Math.random() * CHARS_LEN));
        }
        data[`field-${j.toString().padStart(3, '0')}`] = str;
      }
      await setDoc(document, data);
      setNOfDocs(i + 1);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={createDocs}>
        <Text>Create docs</Text>
      </TouchableOpacity>
      <Text>{nOfDocs} documents written</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
