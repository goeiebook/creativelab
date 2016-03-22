
Chrome's Dev Console remembers everything you type, including mistakes and typos. This results in a polluted list of suggestions. This was very annoying to me, and I began to search for a remedy. As it turns out, the remedy is non-trivial. But while clicking through the menus I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

![local storage editor][localstorage]

Pretty-printing the contents of the 'boardStates' key reveals interesting information. It is a JSON data structure, and the names of various elements suggests that it represents the animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page shown at startup. 

The 'shapes' key is where the most interesting details are. Here are keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. A lot of information, but this is exciting. Perhaps there is a way to create an animation using tools other than those provided by the CreativeLab5 application.


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

A good first step is to try and reduce complexity. [This JSON structure](https://github.com/goeiebook/creativelab/blob/master/json/simple.json), for example, removes all shapes from the default page except for the abstract 'G'. I pasted this string into the localstorage field, reloaded the page, and clicked the 'Continue' button.

![simple circle, er, I mean a G.][simplified]

[Here it is, live.](https://www.creativelab5.com/s/m3JEdl). Encouraged by this, I began to edit the JSON manually to make all manner of strange shapes. But the cycle of copy-paste-edit-copy-paste was fatiguing, and manually editing a JSON file is much less efficient than using the available drawing tools (such as activatePen()).

---

Spring was in the air. I'd been in the coffee shop for an hour, and now it was time to leave. I packed up my computer, and walked a few kilometers to another shop. Along the way I passed through a park. Spring was beginning to arrive. Two kids were trying to throw a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. Somewhat uncharacteristically, I addressed them. "Could I show you how to throw that?" They handed it over. I hadn't thrown a boomerang in a long time. I said it, aloud, just to cover my embarassment should it go badly. I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I hand the boomerang back, "Now you try." The kid copies my technique and it flies out in a beautiful wide arc, curving up and around --- and then gets stuck at the top of tree.

---

Experimentation would be a lot easier if the copy-paste-copy-paste routing could be avoided. The chrome dev console was helpful in this regard. This series of commands will erase all the shapes, for example:
```
var boardStateString = window.localstorage.getItem('boardStates');
var boardState = JSON.parse(boardStateString);

boardState.shapes = [];
boardStateString = JSON.stringify(boardState);
window.localstorage.setItem('boardStates', boardStateString);

```

Digging around on Google then revealed the "Snippets" feature of Google Chrome. These are browser-based 

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"

[simplified]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpg