import {db} from "../backend/firebaseConnect";
import { app } from "../backend/firebaseConnect"
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail} from 'firebase/auth'

export const createUser = (email, senha) => {

    return new Promise((resolve, reject) => {
        try {
            const auth = getAuth(app)

            createUserWithEmailAndPassword(auth, email, senha)
                .then((userCredential) => {
                    resolve("Usuário criado com sucesso!")
                }).catch((error) => {
                    const errorCode = error.code;
                    console.log(errorCode)

                    if (errorCode === "auth/invalid-email") {
                        reject("Email Inválido!")
                    } else if (errorCode === "auth/email-already-in-use") {
                        reject("Email já está em uso!")
                    } else if (errorCode === "auth/weak-password") {
                        reject("Senha Inválida - senha deve ter mais que 6 caracteres!")
                    } else {
                        reject("Credenciais Inválidas, Tente novamente!")
                    }
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const login = (email, senha) => {

    return new Promise((resolve, reject) => {
        try{
            const auth = getAuth()

            signInWithEmailAndPassword(auth, email, senha)
                .then((data) => {
                    const user = data.user
                    resolve(user)
                })
                .catch(error => {
                    const errorCode = error.code
                    if (errorCode === "auth/user-not-found")
                        reject("Usuário não encontrado!")
                    else
                        reject("Email ou senha inválidos!")
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const resetPassword = async (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        resolve("Um email de redefinição de senha foi enviado para o seu email.");
      } catch (error) {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          reject("Usuário não encontrado!");
        } else {
          reject("Houve um erro ao enviar o email de redefinição de senha.");
        }
      }
    });
};

export const logoff = () => {

    return new Promise((resolve, reject) => {
        const auth = getAuth();

        signOut(auth)
        .then(() => {
            resolve()
        }).catch((error) => {
            reject(error)
        })
    })
}