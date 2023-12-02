import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadPDFFirebase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const pdfRef = ref(getStorage(), `curriculos/${name}`);

  const uploadTask = uploadBytesResumable(pdfRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
}

export const getPDFFromFirebase = async (pdfName) => {
  return new Promise(async (resolve, reject) => {
    const pdfRef = ref(getStorage(), `curriculos/${pdfName}`);

    try {
      const downloadURL = await getDownloadURL(pdfRef);
      resolve(downloadURL);
    } catch (error) {
      reject(error);
    }
  });
}
