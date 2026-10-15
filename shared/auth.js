import { readStorage, writeStorage } from "./storage.js";

const key = "ledu:session";

export function getSession() {
  // TODO Firebase: substituir pelo estado de autenticação de onAuthStateChanged.
  const session = readStorage(key, null);
  return session && typeof session.email === "string" ? { email: session.email } : null;
}

export function signIn(email) {
  // TODO Firebase: usar signInWithEmailAndPassword. O mock não verifica credenciais.
  // A senha é validada apenas no formulário e nunca armazenada.
  const saved = writeStorage(key, { email });
  window.dispatchEvent(new Event("ledu:auth"));
  return saved;
}

export function signOut() {
  // TODO Firebase: chamar signOut(auth) e observar a mudança de sessão.
  writeStorage(key, null);
  window.dispatchEvent(new Event("ledu:auth"));
}

// TODO Firebase: criar conta com createUserWithEmailAndPassword quando houver
// o formulário aprovado; recuperação usará sendPasswordResetEmail.
