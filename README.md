## Discovery Requires Circumstances

Any story must begin with a set of circumstances. I heard about Google Creative Lab while trying to promote myself. The chain of events went like this: I learn about a new divison of the Play Store, I tweet at the twitter account, they liked my tweet, and I subscribe to their channel. Then a few days later they retweet something about a new Creative Lab 5 site.

![the application site][default]


A one year paid program. I'm not a designer, but I might be an artist. They're looking for new applicants. [The application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" And the form contains a checkbox for wildcards. View Source reveals a hidden puzzle. Solving the puzzle yields a "Techno Crab" badge. I'm brilliant! I'm going to to be a Fiver! Feeling elite, I complete the application with a short film titled "Idempotent", and send it off.

It's titled Idempotent. Genius. A shoo-in for sure.

A day elapses. Then another. My ego wanes. I revisit my application, to assure myself of it's brillance. But, [It's broken](https://www.creativelab5.com/s/puukkz). It doesn't play as designed, and the dev console shows an error. This is disappointing. Searching twitter for the #creativelab5 hashtag turns up the account of one of the designers. [I tweet to him](https://twitter.com/Andrew_Herzog/status/708081805103144960), and point out my application is broken. 

![the response][tweet]

His response is confusing. Is that sarcasm? I'm not a very social creature. But then something unanticipated happens: my profile begins to receive views. Dozens of views. My six month old twitter account was getting attention. Twitter Analytics claimed profile views were up by 1000%.

---

Winter was finally coming to a close. The snow began to melt. When snow melts it leaves a distinctive aftermath. Little piles of gravel, salt, and soggy cigarette butts. Like glacial till; with snowplow scars and single wet mittens.

I saw a rubber ball where a snowbank used to be. I picked it up. Solid rubber, white, with a grey splotch. A lot of bounce. A dog toy. I put it in my pocket and took it with me. As I walked I thought about how I should [tweet about it](https://twitter.com/goeiebook/status/709378927219728384). And I should carry the ball with me at all times. Because if you carry a thing like this with you at all times, you're bound to discover something new.

---

Checking the analytics was addictive. So that's why people love this stuff. [Here's a Bansky for that][bansky]. I was king of the #creativelab5 hashtag. The submissions of other applicants were bland, like mine. But none were broken, like mine. And then up pops [this masterpiece](https://twitter.com/zachboth/status/709920328093294592).

![the both submission][both]

Such excellent presentation, addressed directly to the current Fivers, with three images showing the design process. It shames the work of everyone.

Stay cool, Abrie. You can learn a lot from guys like this.

Immediately open up the site and look deeper. How did he make that thing? The Techno Crab mode unlocks additional tools: a pen tool, gradients, stroke control. But they are difficult to use. The anchor tool doesn't seem to work. The UI isn't good. Clicking the tiny verticies is difficult. The play bar disappears at inconvienent times and reappears at inconvienient times. Heavy CPU usage slows everything down. 

The Chrome Dev console helpfully remembers everything you enter, including mistakes and typos. So after a bit of hacking around, the suggestion list becomes polluted.  Annoyed by this, I begin searching for a remedy. And, as it turns out, the remedy is non-trivial. But during the process I stumble onto the Resources Tab, which has an entry named Local Storage. [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage). The CreativeLab5 site appears to use it. 

![local storage editor][localstorage]

Pretty-printing the contents of the 'boardStates' key reveals interesting information. It is a JSON data structure, and the names of various elements suggests that it represents the animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the JSON for the default page. 

The 'shapes' key is where the most interesting details are. Here are keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. This is quite exciting. Perhaps there is a way to create an animation using tools other than those provided by the site.

```javascript
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

When faced with a lot of data, a good first step is to try and reduce complexity. [This JSON structure](https://github.com/goeiebook/creativelab/blob/master/json/simple.json), for example, removes all shapes from the default page except for the abstract 'G'. I pasted this string into local storage, , reloaded the page, and clicked the 'Continue' button. Voila!

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

```javascript
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

[default]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/default.jpg

[bansky]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/bansky.jpg

[tweet]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/tweet.jpg

[both]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/both.jpg

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png

[simplified]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpg

[snippets]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/snippets.jpg

[basketball]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/basketball.jpg

[mess]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/mess.jpg

