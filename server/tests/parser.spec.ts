import {Parser} from "./../src/Util/Parser";

let expectedAST = {
    "kind": "program",
    "loc": {
      "source": null,
      "start": {
        "line": 1,
        "column": 0,
        "offset": 0
      },
      "end": {
        "line": 13,
        "column": 1,
        "offset": 120
      }
    },
    "children": [
      {
        "kind": "namespace",
        "loc": {
          "source": null,
          "start": {
            "line": 3,
            "column": 0,
            "offset": 7
          },
          "end": {
            "line": 13,
            "column": 1,
            "offset": 120
          }
        },
        "children": [
          {
            "kind": "class",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 0,
                "offset": 23
              },
              "end": {
                "line": 13,
                "column": 1,
                "offset": 120
              }
            },
            "name": "Foo",
            "isAnonymous": false,
            "extends": null,
            "implements": null,
            "body": [
              {
                "kind": "property",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 7,
                    "column": 12,
                    "offset": 47
                  },
                  "end": {
                    "line": 7,
                    "column": 16,
                    "offset": 51
                  }
                },
                "name": "baz",
                "value": null,
                "isAbstract": false,
                "isFinal": false,
                "visibility": "private",
                "isStatic": false
              },
              {
                "kind": "method",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 9,
                    "column": 11,
                    "offset": 65
                  },
                  "end": {
                    "line": 12,
                    "column": 5,
                    "offset": 118
                  }
                },
                "name": "baz",
                "arguments": [],
                "byref": false,
                "type": null,
                "nullable": false,
                "body": {
                  "kind": "block",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 10,
                      "column": 4,
                      "offset": 84
                    },
                    "end": {
                      "line": 12,
                      "column": 5,
                      "offset": 118
                    }
                  },
                  "children": [
                    {
                      "kind": "return",
                      "loc": {
                        "source": null,
                        "start": {
                          "line": 11,
                          "column": 8,
                          "offset": 94
                        },
                        "end": {
                          "line": 11,
                          "column": 26,
                          "offset": 112
                        }
                      },
                      "expr": {
                        "kind": "propertylookup",
                        "loc": {
                          "source": null,
                          "start": {
                            "line": 11,
                            "column": 20,
                            "offset": 106
                          },
                          "end": {
                            "line": 11,
                            "column": 25,
                            "offset": 111
                          }
                        },
                        "what": {
                          "kind": "variable",
                          "loc": {
                            "source": null,
                            "start": {
                              "line": 11,
                              "column": 15,
                              "offset": 101
                            },
                            "end": {
                              "line": 11,
                              "column": 20,
                              "offset": 106
                            }
                          },
                          "name": "this",
                          "byref": false,
                          "curly": false
                        },
                        "offset": {
                          "kind": "constref",
                          "loc": {
                            "source": null,
                            "start": {
                              "line": 11,
                              "column": 22,
                              "offset": 108
                            },
                            "end": {
                              "line": 11,
                              "column": 25,
                              "offset": 111
                            }
                          },
                          "name": "baz"
                        }
                      }
                    }
                  ]
                },
                "isAbstract": false,
                "isFinal": false,
                "visibility": "public",
                "isStatic": false
              }
            ],
            "isAbstract": false,
            "isFinal": false
          }
        ],
        "name": "Foo",
        "withBrackets": false
      }
    ],
    "errors": []
  }

test("Parser process test", () =>{
    let localPath = __dirname + "/" + "stub/";
    let ParserEngine = new Parser(localPath);

    ParserEngine.process();
});

test("Parser parse file test", () =>{
    let localPath = __dirname + "/" + "stub/";
    let ParserEngine = new Parser(localPath);

    expect.assertions(1);

    ParserEngine.parse(localPath+"Bar/Foo.php")
        .then(AST => { expect(AST).toEqual(expectedAST);})
        .catch(error => { console.log(error);});
});
