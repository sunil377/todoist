export function getAuth(arg: any) {
    return {
        auth: true,
    }
}

export function fetchSignInMethodsForEmail(auth: any, email: string) {
    return ['google.com']
}

export class GoogleAuthProvider {
    constructor() {}
}
