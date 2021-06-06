export function parseJson(data) {
    try {
        return JSON.parse(data);
    }
    catch (err) {
        throw new Error("INVALID JSON IN REQUEST BODY");
    }
}
export function parseText(data) {
    return data;
}
