import {db} from "../backend/firebaseConnect";
import {collection, getDocs, query, where} from 'firebase/firestore'

export const getTipoServico = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "tipoServico"))
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

export const getTipoServicoName = (name) => {
    return new Promise(async(resolve, reject) => {
        try {
            const colecao = collection(db, "tipoServico")
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