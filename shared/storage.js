// Só dados públicos de demonstração são persistidos; nunca salve senhas aqui.
const memory = new Map();

export function readStorage(key, fallback) {
  if (memory.has(key)) return memory.get(key) ?? fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return memory.get(key) ?? fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    memory.delete(key);
    return true;
  } catch {
    memory.set(key, value);
    return false;
  }
}
