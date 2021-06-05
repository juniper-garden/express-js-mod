import { MessageValue } from "helpers/messageTranslation";
import Response from "helpers/Response";
const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
export default class Express {
    serverInstance;
    server;
    defaultPort = 80;
    routes = {
        get: {},
        post: {},
        put: {},
        patch: {},
        delete: {},
    };
    constructor(ModdableHttpServer) {
        this.serverInstance = this.curriedServer(ModdableHttpServer);
    }
    createResponse = () => {
        return new Response();
    };
    curriedServer = (Server) => {
        return (port) => {
            return new Server({ port: port || this.defaultPort });
        };
    };
    listen(port) {
        let server = this.serverInstance(port);
        this.server = server;
        let self = this;
        server.callback = function instantiateRoute(message, val1, val2) {
            switch (message) {
                case MessageValue.error:
                    break;
                case MessageValue.connection:
                    this.inboundRequest = {
                        state: 'status',
                        headers: [],
                        path: null,
                        httpMethod: null,
                        data: null
                    };
                    this.outboundResponse = self.createResponse();
                    break;
                case MessageValue.status:
                    this.inboundRequest.path = val1;
                    this.inboundRequest.httpMethod = val2;
                    this.inboundRequest.state = 'headers';
                    break;
                case MessageValue.header:
                    if (!val1 || !val2)
                        break;
                    this.inboundRequest.headers.push(val1);
                    this.inboundRequest.headers.push(val2);
                    break;
                case MessageValue.headersComplete:
                    this.inboundRequest.state = "fragment";
                    return String;
                case MessageValue.requestFragment:
                    break;
                case MessageValue.requestComplete:
                    this.inboundRequest.state = "done";
                    break;
                case MessageValue.prepareResponse:
                    const req = this.inboundRequest;
                    const res = this.outboundResponse;
                    const handlerCb = self.routes[req.httpMethod][req.httpMethod];
                    if (!handlerCb)
                        return { headers: ["Content-type", "text/html"], body: "Resource Not Found", status: 404 };
                    // Do stuff here with routes
                    let result = () => {
                        handlerCb(req, res);
                        return res.build();
                    };
                    return result;
                case MessageValue.responseFragment:
                    // do stuff here with chunked data
                    break;
                case MessageValue.responseComplete:
                    // do stuff here with posts
                    this.socket.close();
                    break;
            }
        };
    }
    get = (path, cb) => this.addRoute('get')(path, cb);
    post = (path, cb) => this.addRoute('post')(path, cb);
    put = (path, cb) => this.addRoute('put')(path, cb);
    patch = (path, cb) => this.addRoute('patch')(path, cb);
    delete = (path, cb) => this.addRoute('delete')(path, cb);
    addRoute = (method) => {
        const valid = validMethods.find(m => m.toLowerCase() === method);
        if (!valid)
            throw new Error('That HTTP method is not valid.');
        return (path, cb) => {
            if (!path || !cb)
                throw new Error('There was a big no-no');
            let routeExist = this.routes[method][path];
            if (routeExist)
                throw new Error('There was a big no-no');
            this.routes[method][path] = { cb };
        };
    };
    get allRoutes() {
        return this.routes;
    }
}
