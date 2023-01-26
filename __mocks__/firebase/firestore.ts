export function getFirestore() {
    return {
        db: true,
    }
}

export function addDoc() {
    return { docAdded: true }
}

export function collection() {
    return { collection: 'ok' }
}

export function serverTimestamp() {
    return { date: '24' }
}
