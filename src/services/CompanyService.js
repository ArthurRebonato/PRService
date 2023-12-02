import {db} from "../backend/firebaseConnect";
import {collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc} from 'firebase/firestore'
import { searchByAddress } from "./LocationService";

export const createCompanyBD = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "companies");

            const queryNome = query(colecao, where("nome", "==", dados.nome));
            const queryEmail = query(colecao, where("email", "==", dados.email));

            const nomeSnapshot = await getDocs(queryNome);
            const emailSnapshot = await getDocs(queryEmail);

            if (!nomeSnapshot.empty && !emailSnapshot.empty) {
                reject("Já existe uma Empresa com o mesmo nome e email!");
            } else {
                let coordenadas = await searchByAddress(dados.sede);
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

export const updateCompany = (docId, updatedData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const colecao = collection(db, "companies");
        const userRef = doc(colecao, docId);
  
        let coordenadas = await searchByAddress(updatedData.sede);
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

export const getCompanies = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "companies"))
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

export const getCompanyUid = (uid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const colecao = collection(db, "companies")
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
            reject(error)
        }
    })
}

export const getCompanyByDocumentUID = (documentUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "companies", documentUID);
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.empty) {
                const data = docSnapshot.data();
                data.key = docSnapshot.id;
                resolve(data);
            } else {
                reject("Empresa não encontrada.");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getCompanyByPremium = (premium) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "companies");
            const q = query(colecao, where("premium", "==", premium));

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

export const getTopPremiumCompanies = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "companies");
            const q = query(colecao, where("premium", "==", true));

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

export const deleteCompanyByUID = (companyUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "companies", companyUID);
            const docId = await deleteDoc(docRef);
            resolve(docId);
        } catch (error) {
            reject(error);
        }
    });
}