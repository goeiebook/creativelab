## Discovery Requires Circumstances

Stories begin with a set of circumstances. I heard about Google Creative Lab while trying to promote myself. The chain of events went like this: There's a new divison of the Play Store for unprintable books. I tweet at the tweet at the account. They like my tweet. I swoon and subscribe to their channel. Then a few days later they retweet something about the new Creative Lab 5 site. What is it?

![the application site][default]


A one year paid program. They're looking for new applicants. [The application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" And the form contains a checkbox for wildcards. I'm a wildcard. View Source reveals a hidden puzzle. Solving the puzzle yields a "Techno Crab" badge. I'm brilliant! I'm going to to be a Fiver! Feeling elite, I complete the application with a short film titled "Idempotent", and send it off.

Idempotent. Much genius. A shoo-in for sure.

A day elapses. Then another. My ego wanes. I revisit my application, to assure myself of it's brillance. But, [It's broken](https://www.creativelab5.com/s/puukkz). It doesn't play as designed, and the dev console shows an error. This is disappointing. Searching twitter for the #creativelab5 hashtag turns up the account of one of the designers. [I tweet to him](https://twitter.com/Andrew_Herzog/status/708081805103144960), and point out my application is broken. 

![the response][tweet]

Is that sarcasm? This is confusing. I'm not a very social creature. But then something unanticipated happens: my profile begins to receive views. Dozens of views. My six month old twitter account was getting attention. Twitter analytics claimed profile views were up by 1000%.

---

Winter was finally coming to a close. The snow began to melt. When snow melts it leaves a distinctive aftermath. Little piles of gravel, salt, and soggy cigarette butts. Like glacial till; with snowplow scars and single wet mittens.

I saw a rubber ball where a snowbank used to be. I picked it up. Solid rubber, white, with a grey splotch. A lot of bounce. A dog toy. I put it in my pocket and took it with me. While walking, I thought of [tweet about the ball](https://twitter.com/goeiebook/status/709378927219728384). And realized I should carry the ball with me at all times. Because if you carry a thing like this with you at all times, you're bound to discover something new.

---

Checking analytics is addictive. Moreso when there's more signal than noise. [Here's a Bansky for that][bansky]. I was king of the #creativelab5 hashtag. The submissions of other applicants were bland, like mine. But none were broken, like mine. And then up pops [this masterpiece](https://www.creativelab5.com/s/pnMGi5).

![the both submission][both]

Such excellent presentation, casual phrasing, and three images showing the design process. All the other submissions look pale.

Stay cool, Abrie. You can learn a lot from guys like this.

Immediately open up the site and look deeper. How did Both make this thing? The Techno Crab mode unlocks additional tools: a pen tool, gradients, stroke control. But they are difficult to use. The anchor tool doesn't seem to work. The vertex manipulators are tiny and aggravating. The play bar disappears at inconvienent times, then reappears at an even more inconvienient time. Heavy CPU usage causes my Macbook's fan to spin at top speed. This UI has some serious issues. But apparently it did not hold Both back. 

The Chrome Dev console helpfully remembers everything you enter, including mistakes and typos. The suggestion list becomes polluted after a bit of poking around. Annoyed by this, I begin to searching the menus for a remedy. And, as it turns out, the remedy is non-trivial. But during the process I stumble onto the Resources Tab, which has an entry named Local Storage. [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage). And the CreativeLab5 site appears to use it: 

![local storage editor][localstorage]

Pretty-printing the contents of 'boardStates' reveals interesting information. It is a JSON data structure, and the nomenclature suggests animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the JSON for the default page. 

The 'shapes' key is where the most interesting details are. Keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. This is quite exciting. Perhaps there is a way to create an animation using tools other than those provided by the site.

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

With a chunk of data like this, the first step is to try and reduce complexity. [This JSON structure](https://github.com/goeiebook/creativelab/blob/master/json/simple.json), for example, has all the shapes removed except the first one in the list. Paste this string into local storage, reload the page, click the 'Continue' button --- Voila!

![simple circle, er, I mean a G.][simplified]

[Here it is, live](https://www.creativelab5.com/s/m3JEdl). Encouraged, I began to edit the JSON hapazardly. The workflow went like this:

1. Select boardStates field, CMD-c, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. ```pico pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, CMD-v, reload page.

The [jq](https://stedolan.github.io/jq/) tool is excellent, BTW. But this workflow was not very efficient. Still more fun than using activatePen(), however.

---

Now I'd been in the coffee shop for an hour, and according to decorum it was time to leave. I packed up and walked to a different shop. The route goes through a park. Spring was in the air. Two kids were trying to throw a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them, somewhat uncharacteristically, and said "Could I show you how to throw that?" They handed it over. I said aloud I hadn't thrown a boomerang in a long time. Then I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I hand the boomerang back, "Now you try." The kid copies my technique and it flies out in a beautiful wide arc, curving up and around --- and then gets stuck in a tree.

---

A whole set of possibilities were in mind. Animations could be made without having to use the clumsy Google Creative Lab 5 UI. But, this manual copy-pasting was tiring and error prone. A more programmatic workflow would be better. The dev console's command prompt could help. A series of commands like this, for example, will erase all the shapes:

```javascript
function clearShapes() {
    var boardStateString =
        window.localstorage.getItem('boardStates');
    
    var boardState = 
        JSON.parse(boardStateString);
    
    boardState.shapes = [];
    
    window.localstorage.setItem('boardStates',
        JSON.stringify(boardState));
}

```
That's a pretty simple example. But it shows that code can be saved into a function, and then use to clear the stage with a single command: clearShapes();

But the page must be reloaded in order to load the data from local storage. Which means you loose the javascript context, and then have to re-enter the code. Faced with this problem, a bit of searching reveals: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!

![the snippets panel][snippets]

Now we're talking. Right-click->Run. That's fun. And now we go overboard, copy-pasting blocks of code to generate arrays of shapes and colors. What did those handleIn/handleOut parameters do? Whatever it was, it was interesting. The results became excessive and messy, but I was proud of the result. Even if it wasn't totally clear how the code worked.

![what a mess][mess]

I'm eager to publish this. I click the submit button, sign my "Cover Letter", and wait. The request fails. Try again. Fails again. 500 Server Error. So it works locally, but I'm unable to share the results. This must means I've discovered another "Break It" feature! I tweet about it to the #creativelab5 people; expecting another 1000% increase in profile views.

![what a mess][500error]

---

The following morning I walk through the park and pass the tree that caught the boomerang. The boomerang was gone. But now there was a basketball up there. 

![boomerang replacement][basketball]

I laugh aloud. It is amazing how plots and storylines unfold automatically. And then there is the fractal similarity. I mean, this is like the Peanuts' [kite-eating tree](http://peanuts.wikia.com/wiki/Kite-Eating_Tree). No writer is necessary. These are my thoughts while I bounce my rubber ball along the sidewalk. I wonder what will happen tomorrow. With a bit of luck the story will become even better.

---

The last twitter post did not generate buzz. There is no response and practically no views. That's probably a sign that I didn't break anything. Something about my submission was not acceptable to the server, and it was rejected. So I edit the snippet and reduce the complexity step by step. Until, boom, 200 Status code. The problem was invalid timeline values and too many shapes. There is a limit to how complex animations may be. That's not surprising, in retrospect. I feel foolish.

Reduce the shape count, stick to the available timeline, and change values randomly. Dividing (x,y) coordinates by a constant value results in an interesting effect. Changing the constant value between keyframes results in a beating effect. This is amazing, even if I do not know exactly how it works. [I submit it](https://www.creativelab5.com/s/31KE8L). 200 Status code, all good.

![burst][burst]

---

Over the last few days I've spent quite a bit of time bouncing the white ball. Aside from becoming better at manipulating it, I'm also beginning to notice details of its character. Such as the sound through different environments. For example, [this is what it sounds like](https://youtu.be/8KXGaB3PApY) when walking through a viaduct tunnel.

![spectrogram of a tunnel bounce][tunnelbounce]

---

Dividing two dimensional coordinates by a third number is essentially perspective projection. I remember reading that once in a tutorial on 3D graphics. It's not something one really needs to know, because toolkits like ThreeJS take care of it for you. But it seemed like with some tricks, the Creative Labs application could handle 3D effects. Perhaps then a few more profile views would be generated.

And with that, a bit more work went into code for generating coherent shapes. Setting the handle values to 0's resulted in right angles. Reading on Wikipedia about projective projection pointed out the importance of a focal length parameter. Be aware that if your z coorindate is zero, you'll be dividing by zero. And then, suddenly, [everything works](https://www.creativelab5.com/s/uNwej3). 

![boxillusion][uNwej3]

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

[500error]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/500error.jpg

[basketball]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/basketball.jpg

[mess]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/mess.jpg

[burst]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/burst.gif

[tunnelbounce]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/tunnelbounce.jpg

[uNwej3]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/uNwej3.gif

