export default class Response {
    headers: string[] = [];
    requestStatus: Number = 201;
    body: string = ''
    data: any = null;
    position: any;
    status(status: Number){
        this.requestStatus = status
    }

    json(obj: any) {
        try {
            this.body = JSON.stringify(obj)
            this.headers.push('Content-Type');
            this.headers.push('application/json')
        } catch(err) {
            trace('INVALID JSON DATA')
            throw new Error('INVALID JSON DATA')
        }
    }

    sendResource(resource:any, contentType: string){
        try {
            this.headers.push('Content-Type');
            this.headers.push(contentType)
            this.data = resource;
            this.position = 0;
            return {
                headers: [
                    "Content-type", this.headers,
                    "Content-length", this.data.byteLength,
                ],
                status: this.requestStatus,
                body: true,
            };
        } catch(err) {
            return {
                status: 404,
                headers: [
                    "Content-type", "text/plain",
                ],
                body: "file not found",
            };
        }
    }

    get hasChunkResponse(){
        return this.data
    }

    sendChunkResource(value: any) {
        if (this.position >= this.data.byteLength)
				return;
        const chunk = this.data.slice(this.position, this.position + value);
        this.position += chunk.byteLength;
        return chunk;
    }

    build(){
        return {
            headers: this.headers,
            status: this.requestStatus,
            body: this.body
        }
    }
}