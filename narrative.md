## Discovery Requires Circumstance
    
Stories must begin somewhere. I heard about Google Creative Lab while trying to promote myself. [A retweet](https://twitter.com/PRHDigital/status/707503572733313024) via @editionsatplay mentioned a new Creative Lab 5 site. What is that?
    
![the application site][default]
    
A one year paid program, looking for new applicants. [The application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" The form contains a checkbox for wildcards. I'm a wildcard. View Source reveals a secret puzzle. [Solving the puzzle](https://github.com/mhipley/creativelab5/wiki/The-Google-Creative-Lab-5-Cheat-Sheet) yields a "Techno Crab" badge. Complete the application with an animation titled "Idempotent", and send it off.
    
Idempotent. So clever. A shoo-in for sure.
    
A day elapses. Then another. I revisit my application, and discover [it's broken](https://www.creativelab5.com/s/puukkz). The animation doesn't play as planned and the console shows an error. I had spent a lot of time struggling with the UI. Embarassed, I had a need to explain myself. I address a tweet [to message](https://twitter.com/Andrew_Herzog/status/708081805103144960) one of the designers. A response arrives. 
    
![the response][tweet]
    
Is that sarcasm? I'm not socially adept. Maybe the message wasn't clear. This is confusing. But then something unanticipated happens: attention. Profile views and tweet impressions. Twitter analytics measures an increase of 1000%.
    
---
    
Winter was finally coming to a close. The snow began to melt. When snow melts it leaves a distinctive aftermath. Piles of gravel, salt, and soggy cigarette butts. Like glacial till. Snowplow scars and single wet mittens.
    
In a pile of detritus I found a ball. I picked it up. Solid rubber, white, with a grey splotch. A lot of bounce. Probably a dog toy. I put it in my pocket. While walking, I thought to [tweet about it](https://twitter.com/goeiebook/status/709378927219728384), and formed a plan to carry it with me at all times. Because by doing so you increase the chance of discovering something new.
    
---
    
Checking analytics is addictive. Especially so when more signal than noise. [The alternative is less fun.][bansky]. For now I was king of the #creativelab5 hashtag. I watched the feed with relish, comparing new submissions to my own. They were bland, like mine; but none were broken, like mine. And none had the Techno Crab stamp. Then [this masterpiece](https://www.creativelab5.com/s/pnMGi5) arrives.
    
![the both submission][both]
    
Excellent presentation, casual phrasing, and three images demonstrating aspects of design. And the animation uses clever tricks. I darkened.
    
Stay cool, Abrie. You can learn a lot from guys like this.
    
Immediately open up the site and look deeper. How did Both make this thing? The Techno Crab mode unlocks additional tools: a pen tool, gradients, stroke control. But they are difficult to use. The anchor tool doesn't seem to work. The tiny vertex manipulators are aggravating. The play bar disappears at inconvienent times and reappears when least expected. The pen tool is terrible. Heavy CPU usage causes my Macbook's fan to whine. But apparently none of these issues held Both back. 
    
The [Chrome Dev Console](https://developer.chrome.com/devtools/docs/console) remembers everything you enter, including mistakes and typos. At first this is helpful, but soon becomes pollution. Annoyed, I searched Chrome's menus for a remedy. And, as it turns out, the remedy is non-trivial. But in the process I stumbled onto the [Resources Panel](https://developers.google.com/web/tools/chrome-devtools/iterate/manage-data/), which has an entry named [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage), and within that is an interesting string.
    
![local storage editor][localstorage]
    
Pretty-printing the contents of 'boardStates' reveals a JSON data structure, with nomenclature suggesting animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page. 
    
The 'shapes' key is where the important details are. Keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. This is exciting. Perhaps there is a way to create an animation with tools other than those provided by the site.
    
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
    
Removing all but one of the elements in the shape array produces [this JSON](https://github.com/goeiebook/creativelab/blob/master/json/simple.json). When that is pasted into the local storage field, nothing happens. But when the page is reloaded, the storage is structure is deserialized and --- Voila!
    
![simple circle, er, I mean a G.][simplified]
    
[code](https://www.creativelab5.com/s/m3JEdl).

Encouraged, I make hapazard edits and refresh the page. Like combinatorial chemistry, stochastic search, or percussive repair. The workflow went like this:
    
1. Select boardStates field, CMD-c, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. ```pico pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, CMD-v, reload page.
    
Inefficient, but already better than using the Techno Crab's `activatePen(104743);` or `penToolActivated=true;`
    
---
    
I'd been in the coffee shop for an hour, and decorum suggested it was time to leave. I packed up and walked to a different shop. The route goes through a park. Spring was near. Two kids were throwing a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them and said "Could I show you how to throw that?" They handed it over. I said something about not having thrown a boomerang in a long time. Then I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I handed the boomerang back, "Now you try." The kid copied my technique and it flew out in a wide arc, curved up, around --- and then got stuck in a tree.
    
---
    
With the animation data structure exposed, a whole set of possibilities were in mind. Animations could be made without having to use the clumsy Google Creative Lab 5 UI. But the manual copy-pasting was tiring and error prone. A more programmatic workflow would be better. The dev console's command prompt could help. A series of commands like this, for example, provides a mechanisim for erasing all the shapes:
    
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

That's a pretty simple example, and it duplicated functionality already present in the application (`all.deleteAll()`) But when code can be stored in a function it's a step toward proceedural generation.
    
The problem is that the page must be reloaded in order to load the data from local storage. Which means you lose the javascript context, which then necessitates re-entering the code. Copy-paste helps, but then it's the same problem as before but in a slightly different domain. Looking for a solution turned up: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!
    
![the snippets panel][snippets]
    
Now we're talking. Right-click->Run. That's fun. So we go wild, like a bull in a china shop, copy-pasting blocks of code into snippets generating arrays of shapes and colors. What did those handleIn/handleOut parameters do? Whatever it was, it was interesting. Excessive and messy. But I was proud of the result. Even if it wasn't totally clear how the code worked.
    
![what a mess][mess]
    
I clicked the submit button, signed my "Cover Letter", and waited for the requet to process. It takes a long time. Then it fails. Try again. Fails again. [500 Server Error](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error). So the animation works locally, but remains trapped there. Unshareable. This must mean I've discovered another "Break It" feature! I tweet about it to the #creativelab5 people; expecting another 1000% increase in profile views.
    
![what a mess][500error]
    
---
    
The following morning I passed the tree that caught the boomerang. The boomerang wasn't there anymore. But there was a basketball up there. 
    
![boomerang replacement][basketball]
    
I laughed aloud. Amused by storylines unfolding automatically. And this one had fractal similarity. I mean, this is like the Peanuts' [kite-eating tree](http://peanuts.wikia.com/wiki/Kite-Eating_Tree). These are my thoughts while I bounce my rubber ball along the sidewalk. I wonder what will happen tomorrow. Maybe the story will take another humorous turn.
    
---
    
The post about the 500 Error did not generate buzz. No replies, no tweet impressions, no link clicks. Maybe it wasn't anything unexpected. The error was returned because the submission was unacceptable. That would be expected.

Edit the snippet. Reduce complexity by a bit and resubmit. Repeat until the submission goes through. Eventually it does. That proves it. The problem was invalid timeline values and too many shapes. So there is a limit to how complex animations may be. That's not surprising, in retrospect. Reasonable, even. Embarassing.
    
Begin again with a clean snippet. Generate a set of points. Add some random handleIns and handleOuts. Multiply by trigometric functions. Divide by a constant value. The result looks like fireworks. I don't know exactly how it works, but to an outsider it would seem designed. 
    
![burst][burst]

[live](https://www.creativelab5.com/s/31KE8L). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/31KE8L.js).
    
---
    
Discoveries about the ball begin to emerge after three days of play. Aside from becoming better at manipulating it, I'm also beginning to note character details. Such as the sound it makes in different environments. Splat when it's bounced into a buddle (which also substantially reduces the return energy). Echoed reverberations when bounced through a culvert.
    
![spectrogram of a tunnel bounce][tunnelbounce]

[youtube](https://youtu.be/8KXGaB3PApY).

---
    
Dividing two-dimensional coordinates by a third number is called foreshortening. I learn this reading about [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection). It's not something one needs to know. Toolkits like [ThreeJS](http://threejs.org/) take care of it for you. But maybe with some disciplined application 3D things could be coaxed from the Creative Lab 5 application. Maybe a few more profile views will be generated.

Ah hell, I'm getting addicted. So it goes, into the small hours of the morning. Setting handle values to 0's results in right angles. Read on Wikipedia about the role of a focal length multiplier. Be aware that if the z coorindate is zero, you'll be dividing by zero. If your z-coordinate is less than zero things are going to turn upside down. And then, suddenly, [something works](https://www.creativelab5.com/s/uNwej3). 
    
![boxillusion][uNwej3]

[live](https://www.creativelab5.com/s/uNwej3). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/uNwej3.js).

---

The basketball was no longer in the tree. It vanished. Sometimes stories just end. Maybe the story could be continued as fiction. A bird took the basketball.

I continued to bounce the ball everywhere I went. Surprising observations resulted. For instance, strangers would smile and greet. "Hello", "Nice day", and so on. I won't pretend to understand why that was happening. But maybe it's disarming to see someone play. Neurochemical psychological sociology. There is utility in the discovery. One could use it as a confidence trick, if so inclined.

Once, while waiting in a subway station, I was approached by a man. It started out simply enough. Shalom, shalom. About ten minutes later he had $200 of my dollars in his pocket. His baby daughter needed money for medication. He said I could stay in his house in Tel Aviv. He gave me a number I immediately recognized as fake, but I continued to play into his hands. We rode the subway together, in silence. Both of us knew what the other knew. It was an awkard ride.

"What do you do for a living?" He asked me.

"I'm a programmer."

He seemed surprised, "Are you good it?"

"Good luck with your daughter," I said, and got off the train nine stops too early.

---

Equipped with javascript snippets, and [TinyColor](https://bgrins.github.io/TinyColor/), I produce several animations and spam them under the #creativelab5 hashtag. Profile views continue to accumulate, a 2335% increase since last month. Heady days. This serotonin rush is normal. It's what feeds the world.

[live](https://www.creativelab5.com/s/cWcMsq).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/cWcMsq.js).|[live](https://www.creativelab5.com/s/aIZcsx).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/aIZcsx.js).|[live](https://www.creativelab5.com/s/shv7V4).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/shv7V4.js).
:-----------------:|:-----------------:|:-----------------:
![cWcMsq][cWcMsq]  |![aIZcsx][aIZcsx]  |![shv7V4][shv7V4]


---

While passing through the park I find the basketball, hidden in undergrowth. I smiled and picked it up. But something felt wrong. It was cold and limp. Stabbed. Disgusted, I dropped it and walked away. A few hours later I thought to take a picture of it. Because the basketball was now part of this story. I returned and photographed it. Then I picked it up and dropped it into a garbage can. As it fell it displaced air. The air stank of dog shit.

![stabbed basketball][brokenball]

---

Suddenly the workflow stops working. Changes to the localstorage structure no longer persist across page reloads. Is there a parallel to the fate of the basketball? Have the Creative Lab staff closed a hole? When this type of thing happens the answer might be found in the source code. It's not obfuscated, but it is big and noisy. Chrome dev console slows to a crawl. Text search for 'boardStates', and find:

![this is useful][setstage]

`setStageFromLocal()` ... Was that always there? Invoke the function and the stage populates with what's in local storage. And, more importantly, it persits across reloads. Why did I not think of looking for this before? What else am I blind to?

The function greatly increases productivity. Updates to the stage are now instantenous and do not require a page reload. They can even be applied while the animation is running.

I wonder what the handleIn/handleOut parameters do. From the source code it's apparent that [PaperJS](http://paperjs.org/) is used. A search for "paperjs handlein" provides [documentation about the parameter](http://paperjs.org/reference/segment/#segment). So --- the handles define points on tangent curves. That doesn't mean much to me. An experiment is in order. Write code to arrange tangent points in a circle. The result looks like flowers and leaves. This spawns another run of prototypes. 

[live](hyjJZBH.web) [code](yjJZBH.js)|[live](Diu8WJ.web) [code](Diu8WJ.js)|[live](rnqNpZ.web) [code](rnqNpZ.js)
:--------------:|:--------------:|:--------------:
![yjJZBH][yjJZBH.gif]|![Diu8WJ][Diu8WJ.gif]|![rnqNpZ][rnqNpZ.gif]

---

Discovered counter intuitive ball behavior. If thrown down and forward at a sharp angle, under a low ceiling, the ball will bounce up and off the ceiling. But instead of continuing forward as expected, it will return toward the thrower. This is easily reproducible. It's wonderful. I spent quite a bit of time experimenting with angles, enjoying the surprise. The phenomenon appears due to the spin imparted when throwing a ball foward, but more study is necessary.

---

As the number of prototypes increases, common code elements become apparent. For example, all the prototypes contain functions to access the localstorage structure. Those functions should be stored in a single reusable place. The most obvious solution is a dedicated snippet. But then snippet must be re-run whenever the page is reloaded. And as the number of components grows, the cycle of right-click-run becomes rote. It's time for an automated solution.

The solution requires running a local server. Implementing it is more complicated than expected. Several surprising stumbling blocks. Why am I going to all this trouble? Surely time would be better spent elsewhere. And then the local server springs to life and serves without error. A thrill results. And, as a bonus, now third party libraries can be easily loaded. Such as [tinycolor](https://bgrins.github.io/TinyColor/) and [smooth.js](https://github.com/osuushi/Smooth.js/).

This is the snippet that interfaces with the local server:

```javascript
addScriptSrc("https://localhost:4443/tinycolor.js");
addScriptSrc("https://localhost:4443/Smooth-0.1.7.js");
addScriptSrc("https://localhost:4443/boardinterface.js");
addScriptSrc("https://localhost:4443/main.js");

function addScriptSrc(src) {
    var preexisting = 
        document.querySelector(`script[src^='${src}']`);
    
    if (preexisting) {
        document.head.removeChild(preexisting);
    }
    
    var script = document.createElement('script');
    script.src = `${src}?cacheBust=${Date.now()}`;
    script.async = false;
    document.head.appendChild(script);
}
```

Using it requires: [simple-https-server.py](https://raw.githubusercontent.com/goeiebook/creativelab/master/server/simple-htps-server.py), [chrome-csp-disable](https://github.com/PhilGrayson/chrome-csp-disable) and a self-signed certificate.

---

After nearly a week with the ball I've discovered several ways to throw and catch it. One method is to bounce it forward from behind me; then catch it in a downturned palm as my arm swings forward. For this to work the ball must be thrown quite hard. During one attempt it strikes a pebble and ricochets off the path. When I retrieve it, I find it landed in the middle of a jeweled bracelet. My camera's sensor turns the copper and cubic zirconia into gold and diamonds.

![treasure][jewels]

---

A character begins to follow me on Twitter. He is my first follower. He is generous with likes, and we enter into an exchange about hidden aspects of the Creative Lab 5 application. Such as the meaning of the six base-2 numbers surrounding the Techno Crab. And the utility of specific fields in a submitted application; for instance `is_hacker` activates the Techno Crab. The field named `rain` is less clear.

Techno|Rain
:--------------:|:--------------:
![technocrab][technocrab]|![set rain to try][rainflag]


The message around the crab logo spells TECHNO. The rain flag can be set to true using the code below, then submitting the application.

```javascript
var boardState = JSON.parse(
    window.localStorage.getItem('boardStates'));

extras['rain'] = true;
boardState.rain = true;

window.localStorage.setItem('boardStates',
    JSON.stringify(boardState));
```

But setting the rain flag to true does not appear to have any visible effect. I do not examine the issue any further.

---

The number of profile views slows. My submissions to not garner likes from an persons of influence. The motivation begins to wane. The urge to write returns. I begin recording this story. One night freezing rain falls onto the city. Ice coats everything. It is beautiful. It was caused by setting the rain flag to `true`. I say that because it is the nature of humans to discern connection and analogy. In this case it is spurious, but the observation is fun to observe. Yet, what is to say that there no connection? Maybe it's like the recent theories about the [relationship between computational complexity and event horizons](http://www.nature.com/news/theoretical-physics-complexity-on-the-horizon-1.15285). The mathematics are out of reach, but the thoughts play while I bounce the white ball on bubbles of air under ice.

![bubbleball framecap][bubbleball]

[youtube](https://youtu.be/lo1q3oU93UM)

---

I stop making new animations. But I watch the stream for new submissions. Most are bland and uninspired. But occasionally a remarkable one pops up. Like [this one](https://creativelab5.com/s/uJclLz)

These complex ones are interesting, and their mechanics are intriguing. I want to see how they work. View Source of a published application to see a `<script>` tag with javascript assigning a dictionary to a variable named `shareData`. This data cannot be extracted as JSON because it contains javascript. That fact took a few tries to understand. The way to read it is to use [javascript eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) it. Generally speaking, that's a dangerous thing to do. But in this case it's probably ok. Once the shareData variable is populated into a javascript context, it is becomes a simple matter to copy it into the boardStates structure. Refreshing the stage then shows the animation, where it can be studied.

By studying the animations of Pinto and Both, I learn that they are clever people.


[todo; code and images]

---

One morning I returned to the culvert to experiment with the bounce-back phenomenon. On the first throw the angle is too shallow. It fails to reach the ceiling, and continues forward instead. It bounces happily along, and then plops into the rushing stream. Gone. Anyone watching would have thought I threw it in deliberatly. That was clumsy. I film the space where the ball was last seen.

[insert film]
---

One morning the temperative climbs above zero. Now spring is gaining momentum. The trees shed their coats of ice. Cracking and crashing sounds fill the world. It is dangerous. A small piece falls from high up, striking my finger. It breaks skin and I bleed.

---

I miss the white ball. When I pass the place it fell in, I always peer into the water and look along the banks. There is not much hope for recovery. But a few blocks further, along a sidewalk through a park, I find another ball. Day-glo orange, a miniature tennis ball. It is wet and disgusting, but I pick it up anyway. It does not bounce well. Despite the bright color, it is sad. The third ball of this story. I cannot leave it.

I wash it in the sink of a mall bathroom, then dry it in a Dyson Airblade. I resign to carrying it with me.

[todo: image]
---

notes for future development:
- Recollection of being mugged in Windhoek.

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

[yjJZBH.gif]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/yjJZBH.gif

[Diu8WJ.gif]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/Diu8WJ.gif

[rnqNpZ.gif]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/rnqNpZ.gif

[yjJZBF.web]:
https://www.creativelab5.com/s/yjJZBH

[Diu8WJ.web]:
https://www.creativelab5.com/s/Diu8WJ

[rnqNpZ.web]:
https://www.creativelab5.com/s/rnqNpZ

[yjJZBF.js]:
https://github.com/goeiebook/creativelab/blob/master/snippets/yjJZBF.js

[Diu8WJ.js]:
https://github.com/goeiebook/creativelab/blob/master/snippets/Diu8WJ.js

[rnqNpZ.js]:
https://github.com/goeiebook/creativelab/blob/master/snippets/rnqNpZ.js

[jewels]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/jewels.jpg

[rainflag]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/rainflag.jpg

[technocrab]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/technocrab.jpg

[bubbleball]:
https://raw.githubusercontent.com/goeiebook/creativelab/master/images/bubbleball.jpg
