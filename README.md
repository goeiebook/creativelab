# Circumstances of Discovery

A few days ago I did not know about Google's Creative Lab. Now I do. I heard about them while trying to promote myself. The chain of events went like this: I heard about a twitter account, I tweeted at that twitter account, they liked my tweet, I subscribed to their channel, they retweet something about the Creative Lab 5.

...Hello, what's this? A one year paid program. They're looking for new applicants. [The application](https://creativelab5.com) is an application, "Write it, design it, code it, move it, break it." And there is a checkbox for wildcards. Viewing Source reveals a hidden puzzle. Solving the puzzle yields a "Techno Crab" badge on your application. I'm brilliant! I'm going to to be a Fiver! Feeling elite, I complete the application with a short film titled "Idempotent", and send it off.

Idempotent. What genius. A shoo-in for sure.

A day rolls by. Then another. I better revisit my application and assure myself of its brillance. But, [It's broken](creativelab5.com/s/puukkz). This is disappointing. A search of #creativelab5 shows Andrew Herzog, a current fiver and one of the site designers. [I tweet at him](https://twitter.com/Andrew_Herzog/status/708081805103144960), pointing out that it's broken. I don't really understand his response, I feel confused, but then something unanticipated happens.  

Dozens of profile views. My six month old twitter account was getting attention. Twitter Analytics said my profile view count was up by 1000%.

---

Winter was finally coming to a close. The snow began to melt. When snow melts it leaves a distinctive aftermath. Little piles of gravel and salt, like glacial till; with snowplow scars, and single wet mittens.

I saw a rubber ball where a snowbank used to be. I picked it up. Solid rubber, white with a grey splotch, and it has a lot of bounce. A dog toy. I put it in my pocket and take it with me. I should [tweet about this](https://twitter.com/goeiebook/status/709378927219728384). Maybe I'll get some more profile views. And I should carry it with me at all times. Because, if you carry a thing like this with you at all times, you're bound to discover something new.

So, everywhere I go I take the white ball. Bouncing and catching, playing with it in order to discover something new.

---

The Chrome Dev console remembers everything you enter, including mistakes and typos. This helpful gesture ultimately yields a polluted list of suggestions. Annoyed by this, I began searching for a remedy. And, as it turns out, the remedy is non-trivial. But during the process I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

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

1. Select boardStates field, CMD-c, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. Edit ```pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, CMD-v, reload page.

The [jq](https://stedolan.github.io/jq/) tool is excellent, BTW. But this workflow was not very efficient. Still more fun than using activatePen(), however.

---

I'd been in the coffee shop for an hour, and now it was time to leave. I packed starting walking to a different shop. Along the way, I passed through a park. Spring was in the air. People were out. Two kids were trying to throw a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them, somewhat uncharacteristically, and said "Could I show you how to throw that?" They handed it over. I hadn't thrown a boomerang in a long time. I made mention of that, aloud, to cover my embarassment it goes badly. I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I hand the boomerang back, "Now you try." The kid copies my technique and it flies out in a beautiful wide arc, curving up and around --- and then gets stuck at the top of tree.

---

Experimentation would be a lot easier if the copy-paste-copy-paste routine could be avoided. The dev console's command prompt can help in this regard. A series of commands like this, for example, will erase all the shapes:

```
var boardStateString = window.localstorage.getItem('boardStates');
var boardState = JSON.parse(boardStateString);

boardState.shapes = [];
boardStateString = JSON.stringify(boardState);
window.localstorage.setItem('boardStates', boardStateString);

```
That's a pretty simple example. The point is that using the console enables more programmatic editing of the boardStates. The reality is that this also eventually becomes tiring. Ideally you want to edit the javascript in a file and then run it from the console. A bit of googling reveals... [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!

![the snippets panel][snippets]

Now with javascript involved, all sorts of stuff can be generated. Here, for example was something that made me very proud:

![what a mess][mess]
---

The next day I passed the tree that had caught the boomerang. The boomerang was gone. But now there was a basketball up there. 

![boomerang replacement][basketball]

---

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"

[simplified]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpg

[snippets]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/snippets.jpg

[basketball]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/basketball.jpg

[mess]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/mess.jpg

