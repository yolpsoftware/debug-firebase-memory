import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const COLLECTION_NAME = 'debug-firestore-memory';
const NUMBER_OF_DOCS_TO_LOAD = 500;

export default function App() {

  // === CODE TO GENERATE THESE DOCUMENTS ===
  /*const [nOfWrittenDocs, setNOfWrittenDocs] = React.useState(0);
  const createDocs = async () => {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const CHARS_LEN = CHARS.length;
    const existingDoc = await getDocs(query(collection(db, COLLECTION_NAME), orderBy('index', 'desc'), limit(1)));
    const existingMaxIndex = existingDoc.docs[0].data().index;
    for (let i = existingMaxIndex + 1; i < 4000; i++) {
      try {
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
        setNOfWrittenDocs(i + 1);
      } catch (e) {
        i--;
        continue;
      }
    }
  }
  useEffect(() => {
    createDocs();
  }, []);*/
  // === END OF CODE TO GENERATE THESE DOCUMENTS ===

  const [loadedFromFirestore, setLoadedFromFirestore] = useState(null);
  const [docs, setDocs] = useState([]);
  const loadDocs = async () => {
    const keys = (await AsyncStorage.getAllKeys())
        .filter(x => x.startsWith('firestore-memory-'));
    debugger;
    if (keys.length < NUMBER_OF_DOCS_TO_LOAD) {
      const qr = await getDocs(query(collection(db, COLLECTION_NAME), where('index', '<', NUMBER_OF_DOCS_TO_LOAD)));
      const loadedDocs = qr.docs;
      setDocs(loadedDocs.map(doc => doc.data()));
      setLoadedFromFirestore(true);
      await Promise.all(loadedDocs.map(doc => {
        AsyncStorage.setItem('firestore-memory-' + doc.id, JSON.stringify(doc.data()));
      }));
    } else {
      const loadedDocs = await Promise.all(keys.map(key => AsyncStorage.getItem(key)));
      setDocs(loadedDocs);
      setLoadedFromFirestore(false);
    }
  }
  const docsTotalSize = docs.map(x => JSON.stringify(x)).reduce((acc, x) => acc + x.length, 0);
  return (
    <View style={styles.container}>
      {/* <Text>{nOfWrittenDocs} documents written</Text> */}
      <View>
        <Text>Loaded {docs?.length} documents {loadedFromFirestore ? 'from Firestore' : loadedFromFirestore === false ? 'from AsyncStorage' : ''}, total size {docsTotalSize}</Text>
      </View>
      <TouchableOpacity onPress={loadDocs} style={{ padding: 8, margin: 8 }}>
        <Text>
          Load Pages
        </Text>
      </TouchableOpacity>
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
