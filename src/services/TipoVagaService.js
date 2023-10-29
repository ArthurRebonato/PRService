import {db} from "../backend/firebaseConnect";
import {collection, getDocs, query, where} from 'firebase/firestore'

export const getTipoVagas = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "tipoVaga"))
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

export const getTipoVagaName = (name) => {
    return new Promise(async(resolve, reject) => {
        try {
            const colecao = collection(db, "tipoVaga")
            const q = query(colecao, where("nome","==",name))
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