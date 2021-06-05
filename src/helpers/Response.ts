
export default class Response {
    headers: String[] = [];
    requestStatus: Number = 201;
    body: String = ''

    status(status: Number){
        this.requestStatus = status
    }

    json(obj: any) {
        try {
            let res = JSON.stringify(obj)
            this.body = res
            this.headers.push('Content-Type');
            this.headers.push('application/json')
        } catch(err) {
            trace('INVALID JSON DATA')
            throw new Error('Not valid JSON')
        }
    }

    build(){
        return {
            headers: this.headers,
            status: this.requestStatus,
            body: this.body
        }
    }
}