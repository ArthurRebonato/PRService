import {db} from "../backend/firebaseConnect";
import {collection, addDoc, getDocs, query, where, updateDoc, deleteDoc} from 'firebase/firestore'

export const createCompanyTalent = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "companyTalent");

            const queryUidUser = query(colecao, where("uidUser", "==", dados.uidUser), where("uidCompany", "==", dados.uidCompany));
            const querySnapshot = await getDocs(queryUidUser);

            if (querySnapshot.size === 0) {
                await addDoc(colecao, dados);
                resolve("Currículo enviado com sucesso!");
            } else {
                resolve("Já foi enviado o currículo!");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getCompanyTalentByUidCompany = (companyUid, aprovado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "companyTalent");
            const q = query(colecao, where("uidCompany", "==", companyUid), where('aprovado', '==', aprovado));
            const querySnapshot = await getDocs(q);
            let registros = [];
            querySnapshot.forEach((item) => {
                let data = item.data();
                data.key = item.id;
                registros.push(data);
            });
            resolve(registros);
        } catch (error) {
            reject(error);
        }
    });
}

export const updateTalentByUserAndCompanyUID = (userUid, companyUid, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const talentCollection = collection(db, 'companyTalent');
            const q = query(talentCollection, where('uidUser', '==', userUid), where('uidCompany', '==', companyUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;

                await updateDoc(docRef, updatedData);

                resolve('Usuário aprovado com sucesso!');
            } else {
                resolve('Nenhum usuário encontrado para aprovação');
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const deleteTalentByUserAndCompanyUID = (userUid, companyUid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const talentCollection = collection(db, "companyTalent");
            const q = query(talentCollection, where("uidUser", "==", userUid), where("uidCompany", "==", companyUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const deletionPromises = querySnapshot.docs.map(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                await Promise.all(deletionPromises);

                resolve("Usuário excluído com sucesso do banco de talentos!");
            } else {
                resolve("Nenhum usuário encontrado para exclusão");
            }
        } catch (error) {
            reject(error);
        }
    });
}