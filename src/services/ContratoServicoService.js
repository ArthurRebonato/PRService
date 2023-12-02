import {db} from "../backend/firebaseConnect";
import {collection, addDoc, getDocs, query, where, updateDoc, deleteDoc} from 'firebase/firestore'

export const createContratoServico = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "contratoServico");

            const queryUidUser = query(colecao, where("uidContratante", "==", dados.uidContratante), where("uidPrestador", "==", dados.uidPrestador));
            const querySnapshot = await getDocs(queryUidUser);

            if (querySnapshot.size === 0) {
                await addDoc(colecao, dados);
                resolve("Pedido de Serviço enviado com sucesso!");
            } else {
                resolve("Já foi enviado o pedido de serviço!");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getContratoServicoByuidPrestador = (uidPrestador, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "contratoServico");
            const q = query(colecao, where("uidPrestador", "==", uidPrestador), where('status', '==', status));
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

export const updatePedidoByUIDs = (uidContratante, uidPrestador, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const talentCollection = collection(db, 'contratoServico');
            const q = query(talentCollection, where('uidContratante', '==', uidContratante), where('uidPrestador', '==', uidPrestador));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;

                await updateDoc(docRef, updatedData);

                resolve('Pedido de serviço aceito!');
            } else {
                resolve('Nenhum pedido encontrado para ser aceito!');
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const deletePedidoByUIDs = (uidContratante, uidPrestador) => {
    return new Promise(async (resolve, reject) => {
        try {
            const talentCollection = collection(db, "contratoServico");
            const q = query(talentCollection, where("uidContratante", "==", uidContratante), where("uidPrestador", "==", uidPrestador));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const deletionPromises = querySnapshot.docs.map(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                await Promise.all(deletionPromises);

                resolve("Pedido de serviço recusado!");
            } else {
                resolve("Nenhum pedido encontrado para ser recusado!");
            }
        } catch (error) {
            reject(error);
        }
    });
}