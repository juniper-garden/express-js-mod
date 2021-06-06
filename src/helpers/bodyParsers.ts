export function parseJson(data: string) {
    try {
        return JSON.parse(data)
    } catch (err) {
        throw new Error("INVALID JSON IN REQUEST BODY")
    }
}

export function parseText(data: string) {
    return data
}