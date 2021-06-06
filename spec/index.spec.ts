import Express, { HttpServer } from '../src/express-js-mod';


describe('Unit Tests for Express', () => {
    it('Should build a class fine', () => {
        const errorPayload = {
            message: -1
        }

        class MockServer implements HttpServer{
            port?: Number
            constructor(port?: Number){
                this.port = port
            }
            close = jest.fn(() => true)
            callback = jest.fn(() => errorPayload)
        }

        let express = new Express(MockServer)

        expect(express).toBeTruthy()
    })

    describe('Route methods', () => {
        let express
        beforeAll(() => {
            const errorPayload = {
                message: -1
            }
    
            class MockServer implements HttpServer{
                port?: Number
                constructor(port?: Number){
                    this.port = port
                }
                close = jest.fn(() => true)
                callback = jest.fn(() => errorPayload)
            }
    
            express = new Express(MockServer)
        })

        it('Should build a class fine', () => {
            let fakeCbOne = jest.fn()
            let fakeCbTwo = jest.fn()
            express.get('/path', fakeCbOne)
            express.get('/hello', fakeCbTwo)
            
            expect(express.allRoutes.get.size).toBe(2)
            express.allRoutes.get.get('/path').cb()
            expect(fakeCbOne).toHaveBeenCalledTimes(1)

            express.allRoutes.get.get('/hello').cb()
            expect(fakeCbTwo).toHaveBeenCalledTimes(1)
        })

        it('Should build a class fine', () => {
            let fakeCbOne = jest.fn()
            let fakeCbTwo = jest.fn()

            express.post('/path', fakeCbOne)
            express.post('/hello', fakeCbTwo)
            
            expect(express.allRoutes.get.size).toBe(2)
            express.allRoutes.post.get('/path').cb()
            expect(fakeCbOne).toHaveBeenCalledTimes(1)
            express.allRoutes.post.get('/hello').cb()
            expect(fakeCbTwo).toHaveBeenCalledTimes(1)
        })
        it('Should blow up trying to add a route with invalid http method', () => {
            expect(() => express.addRoute('cool')).toThrow(Error)
            expect(() => express.addRoute('cool')('/path', jest.fn)).toThrow(Error)
        })

        it('Should blow up adding a route without a path or cb', () => {
            expect(() => express.addRoute('post')(null, jest.fn)).toThrow(Error)
            expect(() => express.addRoute('get')('test', null)).toThrow(Error)
        })
    })

    
})