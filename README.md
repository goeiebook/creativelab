# Circumstances of Discovery

If you've looked into the Creativelab5.com application site, than you've learned about the Techno Crab feature. When activated, you are able to use the Chrome dev console to enhance your creative ability.

The console remembers everything you type, including mistakes and typos. This helpful gesture ultimately yields a polluted list of suggestions. Annoyed by this, I began searching for a remedy. And, as it turns out, the remedy is non-trivial. But during the process I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

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

[Here it is, live](https://www.creativelab5.com/s/m3JEdl). Encouraged by this, I began to edit the JSON hapazardly. I developed a workflow that went like this:

1. Select boardStates field, cmd-C, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. Edit ```pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, cmd-V, reload page.

The [jq](https://stedolan.github.io/jq/) tool is excellent, BTW. But this workflow was not very efficient. Still more fun than using activatePen(), however.

---

I'd been in the coffee shop for an hour, and now it was time to leave. I packed up my computer, and walked a few kilometers to another one. Spring was near. I passed through a park. Two kids were trying to throw a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I addressed them, somewhat uncharacteristically, "Could I show you how to throw that?" They handed it over. I hadn't thrown a boomerang in a long time. I made mention of that, aloud, to cover my embarassment should it go badly. I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I hand the boomerang back, "Now you try." The kid copies my technique and it flies out in a beautiful wide arc, curving up and around --- and then gets stuck at the top of tree.

---

Experimentation would be a lot easier if the copy-paste-copy-paste routine could be avoided. The dev console's command prompt can help in this regard. A series of commands like this, for example, will erase all the shapes:

```
var boardStateString = window.localstorage.getItem('boardStates');
var boardState = JSON.parse(boardStateString);

boardState.shapes = [];
boardStateString = JSON.stringify(boardState);
window.localstorage.setItem('boardStates', boardStateString);

```
That's a pretty simple example. The point is that using the console enables more programmatic editing of the boardStates. The reality is that this also eventually becomes tiring. Really what you want is to edit the javascript in a file and then just run it from the command line. A bit of googling reveals: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en).

Digging around on Google then revealed the "Snippets" feature of Google Chrome.

![the snippets panel][snippets]


[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"

[simplified]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpg

[snippets]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/snippets.jpg