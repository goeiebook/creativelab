## Discovery Requires Circumstance
    
Stories must begin somewhere. I heard about Google Creative Lab while trying to promote myself. [A retweet](https://twitter.com/PRHDigital/status/707503572733313024) via @editionsatplay mentioned a new Creative Lab 5 site. What is that?
    
![the application site][default]
    
    
A one year paid program, looking for new applicants. [The application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" And the form contains a checkbox for wildcards. I'm a wildcard. View Source reveals a secret puzzle. [Solving the puzzle](https://github.com/mhipley/creativelab5/wiki/The-Google-Creative-Lab-5-Cheat-Sheet) yields a "Techno Crab" badge. I feel brilliant. I'm going to be admitted to a club of geniuses. Complete the application with an animation titled "Idempotent", and send it off.
    
Idempotent. So clever. A shoo-in for sure.
    
A day elapses. Then another. I revisit my application, and discover that [it's broken](https://www.creativelab5.com/s/puukkz). The animation doesn't play as planned and the console shows an error. Embarassed, I use twitter [to message](https://twitter.com/Andrew_Herzog/status/708081805103144960) one of the designers. A response arrives. 
    
![the response][tweet]
    
Is that sarcasm? I'm not socially adept. This is confusing. But then something unanticipated happens: profile views. Dozens of them. Twitter analytics measures an increase of 1000%.
    
---
    
Winter was finally coming to a close. The snow began to melt. When snow melts it leaves a distinctive aftermath. Piles of gravel, salt, and soggy cigarette butts. Like glacial till. Snowplow scars and single wet mittens.
    
In a pile of detritus I found a rubber ball. I picked it up. Solid rubber, white, with a grey splotch. A lot of bounce. A dog toy. I put it in my pocket. While walking, I thought to [tweet about the ball](https://twitter.com/goeiebook/status/709378927219728384). And formed a plan to carry the ball with me at all times. Because by carrying something at all times you're bound to discover something new.
    
---
    
Checking analytics is addictive. Especially when more signal than noise. [The alternative is less fun.][bansky]. For now I was king of the #creativelab5 hashtag. I watched the live feed with relish, comparing new submissions to my own. They were bland, like mine; but none were broken, like mine. And none had the Techno Crab stamp. Then up pops [this masterpiece](https://www.creativelab5.com/s/pnMGi5).
    
![the both submission][both]
    
I darkened. Such excellent presentation, casual phrasing, and three images demonstrating aspects of design. All the other submissions look pale.
    
Stay cool, Abrie. You can learn a lot from guys like this.
    
Immediately open up the site and look deeper. How did Both make this thing? The Techno Crab mode unlocks additional tools: a pen tool, gradients, stroke control. But they are difficult to use. The anchor tool doesn't seem to work. The tiny vertex manipulators are aggravating. The play bar disappears at inconvienent times, then reappears at an even more inconvienient time. The pen tool is terrible. Heavy CPU usage causes my Macbook's fan to whine. But apparently none of these issues held Both back. 
    
The [Chrome Dev Console](https://developer.chrome.com/devtools/docs/console) remembers everything you enter, including mistakes and typos. At first this is helpful, but soon becomes pollution. Annoyed, I search Chrome's menus for a remedy. And, as it turns out, the remedy is non-trivial. But in the process I stumble onto the [Resources Panel](https://developers.google.com/web/tools/chrome-devtools/iterate/manage-data/), which has an entry named [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage, and within that is an interesting string.
    
![local storage editor][localstorage]
    
Pretty-printing the contents of 'boardStates' reveals a JSON data structure, with nomenclature suggesting animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page. 
    
The 'shapes' key is where the important details are. Keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. This is exciting. Perhaps there is a way to create an animation using tools other than those provided by the site.
    
```javascript
{
    "shapes": [{
    "break": false,
    "duped": false,
    "fillColor": "#4285f4",
    "hierarchyIndex": null,
    "isLine": false,
    "keyframes": [{
        "ease": "easeInOutExpo",
        "fillColor": "#4285f4",
        "handlesMoved": true,
        "state": {
            "handleIn": [["Point", 16.9011, 6.97627]],
            "handleOut": [["Point",-16.9011, -6.97627]],
            "point": [["Point",456.21216, 287.17157]]
        },
        "strokeColor": "#4285f4",
        "strokeWidth": 1,
        "time": 0
    }],
    "numSides": 8,
    "strokeColor": "#4285f4",
    "strokeWidth": 1
    }]
}
    
```
    
Removing all but one of the elements in the shape array yeilds [this JSON](https://github.com/goeiebook/creativelab/blob/master/json/simple.json). When pasted into the local storage field, nothing happens. But when the page is reloaded, the storage is structure is deserialized and --- Voila!
    
![simple circle, er, I mean a G.][simplified]
    
[code](https://www.creativelab5.com/s/m3JEdl).

Encouraged, I change the JSON hapazardly. Like combinatorial chemistry, stochastic search, or percussive repair. The workflow went like this:
    
1. Select boardStates field, CMD-c, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. ```pico pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, CMD-v, reload page.
    
The workflow is inefficient, but already better than using the Techno Crab's `activatePen(104743);` or `penToolActivated=true;`
    
---
    
I'd been in the coffee shop for an hour, and decorum suggested it was time to leave. I packed up and walked to a different shop. The route goes through a park. Spring was near. Two kids were throwing a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them, an uncharacteristic behavior, and said "Could I show you how to throw that?" They handed it over. I said something about not having thrown a boomerang in a long time. Then I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I handed the boomerang back, "Now you try." The kid copied my technique and it flew out in a wide arc, curved up, around --- and then got stuck in a tree.
    
---
    
With the animation data structure exposed, a whole set of possibilities were in mind. Animations could be made without having to use the clumsy Google Creative Lab 5 UI. But, the manual copy-pasting was tiring and error prone. A more programmatic workflow would be better. The dev console's command prompt could help. A series of commands like this, for example, provides a mechanisim for erasing all the shapes:
    
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

That's a pretty simple example. And it duplicates functionality already present in the application (`all.deleteAll()`) But demonstrates how code can be stored in a function. A step toward proceedural generation.
    
The problem is that the page must be reloaded in order to load the data from local storage. Which means you loose the javascript context, which then necessitates re-entering the code. Back to the copy-paste problem. Faced with this, a bit of searching reveals: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!
    
![the snippets panel][snippets]
    
Now we're talking. Right-click->Run. That's fun. So we go wild, like a bull in a china shop, copy-pasting blocks of code into a snippet to generate arrays of shapes and colors. What did those handleIn/handleOut parameters do? Whatever it was, it was interesting. Excessive and messy. But I was proud of the result. Even if it wasn't totally clear how the code worked.
    
![what a mess][mess]
    
I'm eager to publish this. I click the submit button, sign my "Cover Letter", and wait. The request fails. Try again. Fails. [500 Server Error](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error). So the animation works locally, but remains trapped there. Unshareable. This must mean I've discovered another "Break It" feature! I tweet about it to the #creativelab5 people; expecting another 1000% increase in profile views.
    
![what a mess][500error]
    
---
    
The following morning I walked past the tree that caught the boomerang. The boomerang wasn't there anymore. But there was a basketball up there. 
    
![boomerang replacement][basketball]
    
I laughed aloud. Amused by storylines unfolding automatically. And this one had fractal similarity. I mean, this is like the Peanuts' [kite-eating tree](http://peanuts.wikia.com/wiki/Kite-Eating_Tree). No writer is necessary. These are my thoughts while I bounce my rubber ball along the sidewalk. I wonder what will happen tomorrow. I know the story will evolve. I hope it will take another humerous turn.
    
---
    
The post about the 500 Error did not generate buzz. No replies, and no views gathered. Maybe it's because it wasn't anything unexpected. The server rejected the submission because it was unacceptable, and that's expected.

To narrow down the problem I edit the snippet; reducing the complexity bit by bit, resubmit, and repeat, until eventually the submission goes through. The problem was invalid timeline values and too many shapes. There is a limit to how complex animations may be. That's not surprising, in retrospect. Embarassing.
    
Now I start with a clean snippet and generate a set of 2d coordinate points. Add some random handles, add some random trigometric functions. Divide coordinates by a constant value. And the result looks like fireworks. This is amazing. Again I do not know exactly how it works, but to an outsider it might seem designed. 
    
![burst][burst]

[live](https://www.creativelab5.com/s/31KE8L). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/31KE8L.js).
    
---
    
Three days with the white ball and discoveries begin to emerge. Aside from becoming better at manipulating it, I'm also begin to notice character details. Such as the sound of it bouncing through different environments. A distinctive splat when it splashes in a puddle (which also substantially reduces the bounce), and the echoes it makes when bounced through a culvert.
    
![spectrogram of a tunnel bounce][tunnelbounce]
[listen](https://youtu.be/8KXGaB3PApY).

---
    
Dividing two-dimensional coordinates by a third number is called foreshortening. I learn this while reading about [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection). It's not something one really needs to know. Toolkits like [ThreeJS](http://threejs.org/) take care of it for you. But maybe with some disciplined application 3D things could be coaxed from the Creative Lab 5 application. Maybe a few more profile views will be generated. Ah hell, I'm getting addicted.
    
So it goes, into the small hours of the morning. Setting handle values to 0's results in right angles. Reading on Wikipedia about projective projection and the importance of a focal length parameter. Be aware that if the z coorindate is zero, you'll be dividing by zero. If your z-coordinate is less than zero things are going to turn upside down (this fact bends my non-mathematical mind). And then, suddenly, [everything works](https://www.creativelab5.com/s/uNwej3). 
    
![boxillusion][uNwej3]

[live](https://www.creativelab5.com/s/uNwej3). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/uNwej3.js).

---

The basketball vanished. It was nowhere to be seen. Sometimes stories just end, I suppose. Maybe the story could be continued as fiction. A bird took the basketball.

Some unexpected side-effects emerged while playing with the white ball. Strangers on the street would smile and greet. "Hello", "Nice day", and so on. I won't pretend to understand why that was happening. Neurochemical psychological sociology. But I can imagine its usefulness. It could be used as a confidence trick.

Once, while waiting in a subway station, I was approached by a man. It started out simply enough. Shalom, shalom. About ten minutes later he had $200 of my dollars in his pocket. Something about his baby daughter needing money for medication. He said I could stay in his house in Tel Aviv, should I ever be around. He gave me a number I immediately recognized as fake, but I continued to play into his hands. I felt very stupid, but ever since I've been more aware of the signals confidence generates. 

---

Equipped with javascript snippets, and [TinyColor](https://bgrins.github.io/TinyColor/), I produce several animations and spam them under the #creativelab5 hashtag. Profile views continue to climb, a 2335% increase since last month. Heady days. This serotonin rush is normal. It's what feeds the world.

[live](https://www.creativelab5.com/s/cWcMsq).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/cWcMsq.js).|[live](https://www.creativelab5.com/s/aIZcsx).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/aIZcsx.js).|[live](https://www.creativelab5.com/s/shv7V4).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/shv7V4.js).
:-----------------:|:-----------------:|:-----------------:
![cWcMsq][cWcMsq]  |![aIZcsx][aIZcsx]  |![shv7V4][shv7V4]


---

I found the basketball, hidden in undergrowth. I smiled and reached out to pick it up. But something was wrong. It had been stabbed. Disgusted, I dropped it and walked away. A few hours later I thought  to take a picture of it. Because a story was forming, about code and circumstance. And the basketball played a key role. So I walked back to the park and photographed the ball. Then I picked it up and dropped it into a garbage can. The garbage can stank like dog shit.

![stabbed basketball][brokenball]

---

Suddenly the workflow stops working. Changes to the localstorage structure no longer persist across page reloads. Is there a parallel to the fate of the basketball? Have the Creative Lab staff closed a hole? In an attempt to understand what's happening, I open the source code and read. It's a large file. Not obfuscated, but noisy. Chrome dev console slows to a crawl converting the code to a readable format. Text search for 'boardStates', and find:

![this is useful][setstage]

`setStageFromLocal()` ... Was that always there? Invoke the function and the stage populates with what's in local storage. And, more importantly, it persits across reloads. Why did I not think of looking for this before? What else am I blind to?

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

[cWcMsq]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/cWcMsq.gif

[aIZcsx]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/aIZcsx.gif

[shv7V4]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/shv7V4.gif

[brokenball]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/brokenball.jpg

[setstage]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/setstage.jpg