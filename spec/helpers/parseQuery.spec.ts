import parseQuery from '../../src/helpers/parseQuery';

describe("Parse Query func unit tests", () => {
    it('Should parse out query params from path', () => {
        let path = "moddable.com/test?id=1&name=cool_name"
        let parsed = parseQuery(path)
        expect(parsed.relative).toBe("moddable.com/test?id=1&name=cool_name")
        expect(parsed.path).toBe("moddable.com/test")
        expect(parsed.search.id).toBe("1")
        expect(parsed.search.name).toBe("cool_name")
    })
})