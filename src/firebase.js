import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDa4cYL7wLR8rJn1C8MXyUVVxsRb2aaugg",
  authDomain: "theoohpoint.firebaseapp.com",
  projectId: "theoohpoint",
  storageBucket: "theoohpoint.appspot.com",
  messagingSenderId: "1039836854227",
  appId: "1:1039836854227:web:f3e4c448e44ab53fc0e126",
  measurementId: "G-C2N44JCB4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload video to Firebase Storage
export const uploadVideoToFirebase = async (file) => {
  if (!file) return null;

  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `campaigns/${timestamp}-${file.name}`;
    const fileRef = ref(storage, filename);

    // Upload the file
    await uploadBytes(fileRef, file);

    // Get the download URL
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Video upload error:", error);
    throw new Error(`Failed to upload video: ${error.message}`);
  }
};

export { auth, db, storage };
