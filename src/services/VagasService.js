import {db} from "../backend/firebaseConnect";
import {collection, addDoc, getDocs, doc, query, where, limit, updateDoc, getDoc, deleteDoc} from 'firebase/firestore'
import { searchByAddress } from "./LocationService";

export const createVaga = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "vagas");

            const queryNome = query(colecao, where("nome", "==", dados.nome));
            const queryLocal = query(colecao, where("local", "==", dados.local));

            const nomeSnapshot = await getDocs(queryNome);
            const localSnapshot = await getDocs(queryLocal);

            if (!nomeSnapshot.empty && !localSnapshot.empty) {
                reject("Já existe uma Vaga com o mesmo nome e local!");
            } else {
                let coordenadas = await searchByAddress(dados.local);
                let lat = coordenadas.lat
                let lng = coordenadas.lng
                dados.lat = lat
                dados.lng = lng

                const docId = await addDoc(colecao, dados);
                resolve(docId);
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const updateVaga = (docId, updatedData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const colecao = collection(db, "vagas");
        const userRef = doc(colecao, docId);
  
        let coordenadas = await searchByAddress(updatedData.local);
        let lat = coordenadas.lat;
        let lng = coordenadas.lng;
        updatedData.lat = lat;
        updatedData.lng = lng;
  
        const docRef = await updateDoc(userRef, updatedData);
        resolve(docRef);
      } catch (error) {
        reject(error);
      }
    });
};

export const getVagas = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "vagas"))
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

export const getVagasUid = (uid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const colecao = collection(db, "vagas")
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

export const getVagasByDocumentUID = (documentUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "vagas", documentUID);
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.empty) {
                const data = docSnapshot.data();
                data.key = docSnapshot.id;
                resolve(data);
            } else {
                reject("Vaga não encontrada.");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getVagasByNome = (nome) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "vagas");
            let q;

            if (nome === "Todos") {
                q = query(colecao, where("divulgado", "==", true), limit(10));
            } else {
                q = query(colecao, where("nomeLower", "==", nome.toLowerCase()), where("divulgado", "==", true), limit(10));
            }

            const querySnapshot = await getDocs(q);
            let registros = [];

            querySnapshot.forEach((item) => {
                const data = item.data();
                data.key = item.id;
                registros.push(data);
            });
            resolve(registros);
        } catch (error) {
            reject(error);
        }
    });
};

export const deleteVagaByDocumentID = (documentUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "vagas", documentUID);
            const docId = await deleteDoc(docRef);
            resolve(docId);
        } catch (error) {
            reject(error);
        }
    });
}

export const deleteVagasByCompanyUID = (companyUid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const vagasCollection = collection(db, "vagas");
            const q = query(vagasCollection, where("uid", "==", companyUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const deletionPromises = querySnapshot.docs.map(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                await Promise.all(deletionPromises);

                resolve("Vagas excluídas com sucesso");
            } else {
                resolve("Nenhuma vaga encontrada para exclusão");
            }
        } catch (error) {
            reject(error);
        }
    });
}

