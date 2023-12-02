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
        const colecao = collection(db, "users");
        const q = query(colecao, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];

          const uidDoc = userDoc.id;
          const userRef = doc(db, "users", uidDoc);

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

export const getUsers = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"))
            let registros = []
            querySnapshot.forEach((item) => {
                let data = item.data()
                data.key = item.id
                registros.push(data)
            })
            resolve(registros)
        } catch (error) {
            reject(error)
        }
        
    })
}

export const getUsersByDocumentUID = (documentUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "users", documentUID);
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.empty) {
                const data = docSnapshot.data();
                data.key = docSnapshot.id;
                resolve(data);
            } else {
                reject("Usuário não encontrado.");
            }
        } catch (error) {
            reject(error);
        }
    });
}

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

export const getUsersByAtuacao = (atuacao) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "users");
            let q;

            if (atuacao.toLowerCase() === "todos") {
                q = query(colecao, where("divulgado", "==", true));
            } else {
                q = query(colecao, where("atuacaoLower", "==", atuacao.toLowerCase()), where("divulgado", "==", true));
            }

            const querySnapshot = await getDocs(q);
            let registros = [];

            querySnapshot.forEach((item) => {
                const data = item.data();
                data.key = item.id;
                registros.push(data);
            });

            registros.sort((a, b) => b.rating - a.rating);

            resolve(registros);
        } catch (error) {
            reject(error);
        }
    });
};

export const getUsersBy = (premium, valor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "users");
            let q;

            if (valor === "Todos") {
                q = query(colecao, where("premium", "==", premium), where("divulgado", "==", true));
            } else {
                q = query(colecao, where("premium", "==", premium), where("atuacaoLower", "==", valor.toLowerCase()), where("divulgado", "==", true));
            }

            const querySnapshot = await getDocs(q);
            let registros = [];
            querySnapshot.forEach((item) => {
                const data = item.data();
                data.key = item.id;
                registros.push(data);
            });

            registros.sort((a, b) => b.rating - a.rating);

            resolve(registros);
        } catch (error) {
            reject(error);
        }
    });
}

export const getTopUsers = (premium, valor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "users");
            let q;

            if (valor === "Todos") {
                q = query(colecao, where("premium", "==", premium), where("divulgado", "==", true));
            } else {
                q = query(colecao, where("premium", "==", premium), where("atuacaoLower", "==", valor.toLowerCase()), where("divulgado", "==", true));
            }
            const querySnapshot = await getDocs(q);
            let registros = [];

            querySnapshot.forEach((item) => {
                const data = item.data();
                data.key = item.id;
                registros.push(data);
            });

            registros.sort((a, b) => b.rating - a.rating);

            const top10 = registros.slice(0, 10);

            resolve(top10);
        } catch (error) {
            reject(error);
        }
    });
};