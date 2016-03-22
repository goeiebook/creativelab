Chrome's Dev Console remembers everything you type, including mistakes and typos. This results in a polluted list of suggestions. This was very annoying to me, and I began to search for a remedy. As it turns out, the remedy is non-trivial. But while clicking through the menus I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

![alt text][localstorage]

Pretty-printing the contents of the 'boardStates' key reveals interesting information. It is a JSON data structure, and the names of various elements suggests that it represents the animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page shown at startup. 

The 'shapes' key is where the most interesting details are. Here are keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. It is a lot of information, but this is quite exciting. Perhaps there is a way to edit this data using tools other than those provided by the CreativeLab5 application.

```json
{
    "shapes": [
        {
            "break": false,
            "duped": false,
            "fillColor": "#4285f4",
            "hierarchyIndex": null,
            "isLine": false,
            "keyframes": [
                {
                    "ease": "easeInOutExpo",
                    "fillColor": "#4285f4",
                    "handlesMoved": true,
                    "state": {
                        "handleIn": [
                            [
                                "Point",
                                16.9011,
                                6.97627
                            ],
                        ],
                        "handleOut": [
                            [
                                "Point",
                                -16.9011,
                                -6.97627
                            ],
                        ],
                        "point": [
                            [
                                "Point",
                                456.21216,
                                287.17157
                            ],
                        ]
                    },
                    "strokeColor": "#4285f4",
                    "strokeWidth": 1,
                    "time": 0
                }
            ],
            "numSides": 8,
            "strokeColor": "#4285f4",
            "strokeWidth": 1
        }
        
    ]
}

```

As a first experiment we reduce the complexity of the structure. [This JSON structure](https://github.com/goeiebook/creativelab/blob/master/json/simple.json), for example, removes all shapes from the default page except for the abstract 'G'. I pasted this structure into the localStorage field and restarted the page. Success!

![alt text][g-only]

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"

[g-only]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpeg