import { MessageValue } from "helpers/messageTranslation";
import Response from "helpers/Response";
import parseQuery from 'helpers/parseQuery';
import { parseJson } from "helpers/bodyParsers";
const validMethods = Object.freeze(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
const Default404 = Object.freeze({ headers: ["Content-type", "text/html"], body: "Resource Not Found", status: 404 });
const bodyParseMap = Object.freeze({
    'application/json': parseJson,
    'application/text+html': (data) => data,
    'application/text': (data) => data,
    'application/html': (data) => data,
    'text/html': (data) => data,
});
export default class Express {
    serverInstance;
    server;
    defaultPort = 80;
    routes = {
        get: new Map(),
        post: new Map(),
        put: new Map(),
        patch: new Map(),
        delete: new Map(),
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
                        headers: {},
                        path: null,
                        httpMethod: null,
                        data: null
                    };
                    this.outboundResponse = self.createResponse();
                    break;
                case MessageValue.status:
                    let parsed = parseQuery(val1);
                    this.inboundRequest.path = parsed.path;
                    this.inboundRequest.params = parsed.search;
                    this.inboundRequest.rawQuery = parsed.query;
                    this.inboundRequest.location = parsed.relative;
                    this.inboundRequest.httpMethod = val2.toLowerCase();
                    this.inboundRequest.state = 'headers';
                    break;
                case MessageValue.header:
                    if (!val1 || !val2)
                        break;
                    this.inboundRequest.headers[`${val1}`] = val2;
                    break;
                case MessageValue.headersComplete:
                    this.inboundRequest.state = "fragment";
                    return String;
                case MessageValue.requestFragment:
                    break;
                case MessageValue.requestComplete:
                    if (!bodyParseMap[this.inboundRequest.headers["content-type"]]) {
                        this.inboundRequest.data = val1;
                    }
                    else {
                        this.inboundRequest.data = bodyParseMap[this.inboundRequest.headers["content-type"]](val1);
                    }
                    this.inboundRequest.state = "done";
                    break;
                case MessageValue.prepareResponse:
                    const req = this.inboundRequest;
                    const res = this.outboundResponse;
                    const route = self.routes[req.httpMethod].get(req.path);
                    if (!route)
                        return Default404;
                    const handlerCb = route.cb;
                    if (!handlerCb)
                        return Default404;
                    // Do stuff here with routes
                    let result = () => {
                        handlerCb(req, res);
                        return res.build();
                    };
                    return result();
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
                throw new Error('Path or callback was not given');
            let routeExist = this.routes[method].get(`${path}`);
            if (routeExist)
                throw new Error('The defined route already exists');
            this.routes[method].set(path, Object.freeze({ cb }));
        };
    };
    get allRoutes() {
        return this.routes;
    }
}
