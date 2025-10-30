// IMPORTANT: This file is for server-side use only.
// It does not include the 'use client' directive.
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, CollectionReference } from 'firebase/firestore';

// This function is intended for server-side use.
export function initializeServerFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

// A specific server-side version of addDocumentNonBlocking that can be awaited.
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  return addDoc(colRef, data);
}
