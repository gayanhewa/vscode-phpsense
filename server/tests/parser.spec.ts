import {Parser} from "./../src/Util/Parser";

test("Parser parse test", () =>{
    let localPath = __dirname + "/" + "stub/";
    let ParserEngine = new Parser(localPath);

    ParserEngine.parse();
});