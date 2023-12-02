import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export const uploadToFirebase = async(uri, name, onProgress) => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();

    const imageRef = ref(getStorage(), `images/${name}`);

    const customMetadata = {
        contentType: 'image/jpeg'
    };

    const uploadTask = uploadBytesResumable(imageRef, theBlob, customMetadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress && onProgress(progress);
        }, 
        (error) => {
            reject(error)
        }, 
        async () => {
            const downloadUrl =  await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
                downloadUrl,
                metadata: uploadTask.snapshot.metadata
            })
        }
        )
    })
}

export const getImageFromFirebase = async (imageName) => {
    return new Promise(async (resolve, reject) => {
      const imageRef = ref(getStorage(), `images/${imageName}`);
      
      try {
        const downloadURL = await getDownloadURL(imageRef);
        resolve(downloadURL);
      } catch (error) {
        reject(error);
      }
    });
};

export const deleteImageFromFirebase = (imageName) => {
    return new Promise(async (resolve, reject) => {
        const imageRef = ref(getStorage(), `images/${imageName}`);

        try {
            const deleteImage = await deleteObject(imageRef);
            resolve(deleteImage);
        } catch (error) {
            reject(error);
        }
    });
};