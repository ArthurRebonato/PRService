import {db} from "../backend/firebaseConnect";
import {collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc} from 'firebase/firestore'

export const createChat = (dados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "chat");

            const [querySnapshot1, querySnapshot2] = await Promise.all([
                getDocs(query(colecao, where("user1", "==", dados.user1), where("user2", "==", dados.user2))),
                getDocs(query(colecao, where("user1", "==", dados.user2), where("user2", "==", dados.user1)))
            ]);

            if (querySnapshot1.size === 0 && querySnapshot2.size === 0) {
                await addDoc(colecao, dados);
                resolve("Chat criado com o usuário!");
            } else {
                resolve("Já tem criado o chat com esse usuário!");
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getChatByDocumentId = (documentUID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "chat", documentUID);
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.empty) {
                const data = docSnapshot.data();
                data.key = docSnapshot.id;
                resolve(data);
            } else {
                reject("Chat não encontrado.");
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getChatByuidUser = (uidUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "chat");

            const q1 = query(colecao, where("user1", "==", uidUser));
            const q2 = query(colecao, where("user2", "==", uidUser));

            const registros = [];

            const snapshot1 = await getDocs(q1);
            registros.push(...snapshot1.docs.map(doc => ({ key: doc.id, ...doc.data() })));

            const snapshot2 = await getDocs(q2);
            const chat2 = snapshot2.docs.map(doc => ({ key: doc.id, ...doc.data() }));

            chat2.forEach(chat => {
                const alreadyExists = registros.some(existingChat => existingChat.key === chat.key);
                if (!alreadyExists) {
                    registros.push(chat);
                }
            });

            if (registros.length > 0) {
                resolve(registros);
            } else {
                resolve('Nenhum chat encontrado!');
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getChatByUIDsUsers = async (uidUser1, uidUser2) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "chat");

            const query1 = query(colecao, where('user1', '==', uidUser1), where('user2', '==', uidUser2));
            const query2 = query(colecao, where('user1', '==', uidUser2), where('user2', '==', uidUser1));

            const registros = [];

            const snapshot1 = await getDocs(query1);
            registros.push(...snapshot1.docs.map(doc => ({ key: doc.id, ...doc.data() })));

            const snapshot2 = await getDocs(query2);
            registros.push(...snapshot2.docs.map(doc => ({ key: doc.id, ...doc.data() })));

            if (registros.length > 0) {
                resolve(registros);
            } else {
                resolve('Nenhum chat encontrado!');
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const updateChatByDocumentId = (documentId, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, 'chat');
            const docRef = doc(colecao, documentId);

            await updateDoc(docRef, updatedData);

            resolve('Alteração realizada com sucesso!');
        } catch (error) {
            reject(error);
        }
    });
}

export const updateChatByUIDsUsers = async (uidUser1, uidUser2, novosDados) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "chat");

            const query1 = query(colecao, where('user1', '==', uidUser1), where('user2', '==', uidUser2));
            const query2 = query(colecao, where('user1', '==', uidUser2), where('user2', '==', uidUser1));

            const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);

            if (!snapshot1.empty) {
                const chatDoc = snapshot1.docs[0];
                const docRef = doc(colecao, chatDoc.id);
                await updateDoc(docRef, novosDados);

                resolve('Documento atualizado com sucesso!');
            } else if (!snapshot2.empty) {
                const chatDoc = snapshot2.docs[0];
                const docRef = doc(colecao, chatDoc.id);
                await updateDoc(docRef, novosDados);

                resolve('Documento atualizado com sucesso!');
            } else {
                resolve('Nenhum chat encontrado para atualizar!');
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const deleteChatByDocumentID = async (documentID) => {
    try {
        const colecao = collection(db, 'chat');
        const docRef = doc(colecao, documentID);

        await deleteDoc(docRef);

        return 'Exclusão realizada com sucesso!';
    } catch (error) {
        throw error;
    }
};

export const deleteChatByUIDsUsers = async (uidUser1, uidUser2) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colecao = collection(db, "chat");

            const query1 = query(colecao, where('user1', '==', uidUser1), where('user2', '==', uidUser2));
            const query2 = query(colecao, where('user1', '==', uidUser2), where('user2', '==', uidUser1));
            
            const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);

            if (!snapshot1.empty) {
                const chatDoc = snapshot1.docs[0];
                const docRef = doc(colecao, chatDoc.id);
                await deleteDoc(docRef);

                resolve('Documento deletado com sucesso!');
            } else if (!snapshot2.empty) {
                const chatDoc = snapshot2.docs[0];
                const docRef = doc(colecao, chatDoc.id);
                await deleteDoc(docRef);

                resolve('Documento deletado com sucesso!');
            } else {
                resolve('Nenhum chat encontrado para deletar!');
            }
        } catch (error) {
            reject(error);
        }
    });
};

