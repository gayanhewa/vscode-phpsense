import {RecursiveFiles} from "./../src/Util/RecursiveFiles";

test("recursiveFiles test", () =>{
    let localPath = __dirname + "/" + "stub/";
    let files = RecursiveFiles(localPath);

    expect(files).toEqual([localPath + 'Bar/Foo.php', localPath + 'Foo/Baz/Bar.php', localPath + 'Foo/Baz.php']);
});