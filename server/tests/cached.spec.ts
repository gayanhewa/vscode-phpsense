import {Cached} from "./../src/Util/Cached";
import * as Filesystem from 'fs';

test("Put string to cache", () =>{
    let cached = new Cached();
    expect.assertions(2);
    cached.set('key', "somevalue")
        .then(isCached => { expect(isCached).toBeTruthy(); })
        .catch(error => { });

    let cachedContent = Filesystem.readFileSync('/tmp/key.json', 'utf8');

    expect(cachedContent).toEqual(JSON.stringify("somevalue"));
});

test("Put json object to cache", () =>{
    let cached = new Cached();
    let obj = {
        "key1": "value1",
        "key2": "value2"
    };

    expect.assertions(2);

    cached.set("json_object_key", obj)
        .then(isCached => { expect(isCached).toBeTruthy(); })
        .catch(error => { });

    let cachedContent = Filesystem.readFileSync('/tmp/json_object_key.json', 'utf8');

    expect(cachedContent).toEqual(JSON.stringify(obj));
});

test("Put json object with special characters to cache", () =>{
    let cached = new Cached();
    let obj = {
        "key1": "value1",
        "key2": "value2",
        "key2%#": "valuEÊeę2",
    };

    expect.assertions(2);

    cached.set("json_object_special_key", obj)
        .then(isCached => { expect(isCached).toBeTruthy(); })
        .catch(error => { });

    let cachedContent = Filesystem.readFileSync('/tmp/json_object_special_key.json', 'utf8');

    expect(cachedContent).toEqual(JSON.stringify(obj));
});

test("Get Cached Value", () => {
    let cached = new Cached();
    let obj = {
        "key1": "value1",
        "key2": "value2",
        "key2%#": "valuEÊeę2",
    };

    expect.assertions(1);

    cached.get('json_object_special_key')
        .then((object) => {
            expect(object).toEqual(obj);
        })
        .catch(error => { console.log(error); });
});

test("Forget Cached Value", () => {
    let cached = new Cached();

    expect.assertions(2);

    cached.forget('json_object_special_key')
        .then((isDeleted) => {
            expect(isDeleted).toBeTruthy();
        })
        .catch(error => { console.log(error); });

    expect(Filesystem.existsSync("/tmp/json_object_special_key.json")).toBeFalsy();
});