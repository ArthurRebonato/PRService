import {db} from "../backend/firebaseConnect";
import {collection, addDoc, getDocs, doc, query, where, updateDoc, getDoc} from 'firebase/firestore'
import { searchByAddress } from "./LocationService";

export const createUserBD = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docId = await addDoc(collection(db, "users"), dados)
            resolve(docId)
        } catch (error) {
            reject(error)
        }
    })
}

export const updateUser = (uid, updatedData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          let coordenadas = await searchByAddress(updatedData.endereco)
          let lat = coordenadas.lat
          let lng = coordenadas.lng
          updatedData.lat = lat
          updatedData.lng = lng
          const docId = await updateDoc(userRef, updatedData);
          resolve(docId)
        } else {
          reject("Usuário não encontrado.");
        }
      } catch (error) {
        reject(error);
      }
    });
};

export const getUserUid = (uid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const colecao = collection(db, "users")
            const q = query(colecao, where("uid","==",uid))
            const querySnapshot = await getDocs(q)
            let registros = []
            querySnapshot.forEach((item) => {
                let data = item.data()
                data.key = item.id
                registros.push(data)
            })
            resolve(registros)
        } catch (error) {
            reject()
        }
    })
}