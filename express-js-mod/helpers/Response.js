export default class Response {
    headers = [];
    requestStatus = 201;
    body = '';
    status(status) {
        this.requestStatus = status;
    }
    json(obj) {
        try {
            this.body = JSON.stringify(obj);
            this.headers.push('Content-Type');
            this.headers.push('application/json');
        }
        catch (err) {
            trace('INVALID JSON DATA');
            throw new Error('INVALID JSON DATA');
        }
    }
    build() {
        return {
            headers: this.headers,
            status: this.requestStatus,
            body: this.body
        };
    }
}
