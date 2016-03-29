## Discovery Requires Circumstance
    
Stories begin somewhere. Nobody was looking at my work. I created a Twitter account because marketing seemed necessary. As a consequence I saw [a retweet](https://twitter.com/PRHDigital/status/707503572733313024) via @editionsatplay. A mention about a program looking for new applicants.
    
![the application site][default]
    
A one year paid experience, [the application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" The form contains a checkbox for wildcards. I'm a wildcard. View Source reveals a secret puzzle. [Solving the puzzle](https://github.com/mhipley/creativelab5/wiki/The-Google-Creative-Lab-5-Cheat-Sheet) yields a "Techno Crab" badge. The badge activated a pen tool but I'm unable to use it. The UI seemed buggy. Maybe that was part of the challenge. I made an animation titled "Idempotent", and sent it off.
    
Idempotent. So clever. A shoo-in for sure.
    
A day elapses. Then another. I revisit my application, and discover [it's broken](https://www.creativelab5.com/s/puukkz). The animation didn't play correctly and the console showed an error. It looked terrible. Embarassed, I felt need to explain myself. Addressed a tweet [to message](https://twitter.com/Andrew_Herzog/status/708081805103144960) one of the designers. A response arrived. 
    
![the response][tweet]
    
Sarcasm? I don't know, is it? Does the academy accept short films? I'm not socially adept. Maybe I wasn't clear. Confusion. But then something unanticipated happens: attention. Profile views and tweet impressions. Twitter analytics measures an increase of 1000%.
    
---
    
Winter was finally coming to a close. The snow melted. When snow goes it leaves a distinctive aftermath. Piles of gravel, salt, and soggy cigarette butts. Like glacial till with snowplow scars and single wet mittens.
    
In a pile of detritus was a white ball. I picked it up. Solid rubber, with a grey splotch. A lot of bounce. Probably a dog toy. I put it in my pocket. I thought to [tweet about it](https://twitter.com/goeiebook/status/709378927219728384), and formed a plan to carry the ball with me at all times. Because by doing so you increase the chance of discovering something new.
    
---

A 1000% percent increase in views isn't very impressive considering it came from zero. But checking analytics became engrossing. There was more signal than noise. [The alternative is less fun.][bansky]. For a while I was king of the #creativelab5 hashtag. I'd watch the feed for new submissions and eagerly compare them to mine. They were bland, like mine; but none were broken, like mine. And none had the Techno Crab stamp. Then [this masterpiece](https://www.creativelab5.com/s/pnMGi5) arrived.
    
![the both submission][both]
    
Excellent presentation, casual phrasing, and three images demonstrating aspects of design. And somehow it included new shapes. This guy had figured out how to use the pen. I darkened.
    
Stay cool, Abrie. You can learn a lot from guys like this.
    
Immediately open up the site and look deeper. How was it made if the pen didn't work? The UI is so clumsy. There's a tool called anchor, but I wasn't able to get that to work either. The tiny vertex manipulators were aggravating. The play bar disappeared at inconvienent times and reappeared when least expected. Heavy CPU usage caused my Macbook's fan to whine. But apparently none of these issues held Both back.
    
For insight into sites, the dev console is the window to use. I entering commands, searching for new things. The [Chrome Dev Console](https://developer.chrome.com/devtools/docs/console) remembers everything entered, including mistakes and typos. At first this is helpful, but soon becomes pollution. Annoyed, I clicked through the menus looking for a remedy. And, as it turns out, the remedy is non-trivial. But the search took me to the [Resources Panel](https://developers.google.com/web/tools/chrome-devtools/iterate/manage-data/), which has an entry named [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage), and within that was an interesting string.
    
![local storage editor][localstorage]
    
Pretty-printing the contents of 'boardStates' reveals a JSON data structure, with nomenclature suggesting animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page. 
    
The 'shapes' key contained lists of keyframes, stroke and fill parameters, point coordinates, and things called 'handles'. Perhaps there was a way to create an animation using tools other than the ones available.
    
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
    
Clearing the shape array of everything except the first element produced [this JSON](https://github.com/goeiebook/creativelab/blob/master/json/simple.json). When pasted into the local storage field, nothing happened. But after a page reload, the storage structure was deserialized and --- Voila!
    
![simple circle, er, I mean a G.][simplified]
    
[code](https://www.creativelab5.com/s/m3JEdl).

Encouraged, I made hapazard edits followed by page refreshes. Like combinatorial chemistry, stochastic search, or percussive repair. The workflow went like this:
    
1. Select boardStates field, CMD-c, shift-tab to terminal
2. ```pbpaste | python -m json.tool > pretty.json```
3. ```pico pretty.json```
4. ```jq -c . simple.json | pbcopy```
5. Select boardStates field, CMD-v, reload page.
    
Inefficient, but already better than nothing. Then somewhere between the refreshes, I accidently clicked the canvas and drew a line. The pen tool had started working. Maybe a bug fix had been deployed, unannounced. Maybe Both had used a pen after all.

---
    
I'd been in the coffee shop for an hour, and decorum suggested it was time to leave. Time to walk to another shop. The route goes through a park. Spring was near. Two kids were throwing a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them and said "Could I show you how to throw that?" They handed it over. I said something about not having thrown a boomerang in a long time. Then I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I handed the boomerang back, "Now you try." The kid copied my technique and it flew out in a wide arc, curved up, around --- and then got stuck in a tree.
    
---
    
Since the animation data was editable, a whole new set of possibilities were possible. Animations could be made without the clumsy Google Creative Lab 5 UI. But editing the structure through the manual copy-pasting was tiring and error-prone. A more programmatic workflow was needed. The dev console's command prompt could help. A series of commands like this, for example, create a function for erasing all the shapes:
    
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

That specific functionality was already present in the application, as `all.deleteAll()`. But when code can be stored in a function it's a step toward proceedural generation.
    
The problem was that the page must be reloaded in order to view changes. That means the javascript context would be lost, and the functions would need to be re-entered every time. It was the same copy-paste problem, but in a slightly different domain. Looking for a solution turned up: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!
    
![the snippets panel][snippets]
    
Now we're talking. Right-click &larr; Run. That's fun. So I went wild, like a bull in a china shop, copy-pasting blocks of code into snippets generating arrays of shapes and colors. What did those handleIn/handleOut parameters do? Whatever it was, it was interesting. Excessive and messy. But I was proud of the result. Even if it wasn't totally clear how the code worked.
    
![what a mess][mess]
    
It seemed worthy submission. I clicked the button, signed my "Cover Letter", and waited for the request to process. Thr request seemed to hang. And then returned an empty error response. Try again. Failed again, [500 Server Error](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error). So the animation worked locally, but remained trapped there. Unshareable. This must mean I've discovered another "Break It" feature! I tweet to the #creativelab5 people; expecting another 1000% increase in profile views.
    
![what a mess][500error]
    
---
    
The following morning I passed the tree that caught the boomerang. The boomerang wasn't there anymore. But there was a basketball up there. 
    
![boomerang replacement][basketball]
    
I laughed aloud. Amused by automatic stories. And this one had fractal similarity. I mean, this is like the Peanuts' [kite-eating tree](http://peanuts.wikia.com/wiki/Kite-Eating_Tree). Those were my thoughts while I bounced the white rubber ball. I wondered what would happen tomorrow. Maybe there would be another good turn in this story.
    
---
    
The post about the 500 Error did not generate buzz. No replies, no tweet impressions, no link clicks. Maybe it wasn't anything unexpected. That is to say, the error was returned because the submission was unacceptable. And that would be expected.

Edit the snippet. Reduce complexity by a bit and resubmit. Repeat until the submission goes through. Eventually it does. That proves it. The problem was invalid timeline values and too many shapes. So there is a limit to how complex animations may be. That's not surprising, in retrospect. Reasonable, even. Embarassing.
    
Begin again with a clean snippet. Generate a random set of coordinates. Add some random handleIns and handleOuts. Multiply by trigometric functions. Divide by a constant value. The result looks like fireworks. How it works is not completely clear. But to an outsider it would seem designed. 
    
![burst][burst]
[live](https://www.creativelab5.com/s/31KE8L). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/31KE8L.js).
    
---
    
Discoveries involving the the ball began after three days of play. Aside from becoming better at manipulating it, I also noted details of its character. Such as the sound made when bounced in different environments. _Splat_ when it landed in a puddle (which also substantially reduced the return energy). Long beautiful reverberations when bounced on a sidewalk through a culvert.
    
![spectrogram of a tunnel bounce][tunnelbounce]
[youtube](https://youtu.be/8KXGaB3PApY).

---
    
Dividing two-dimensional coordinates by a third number is called foreshortening. I learned that term while reading about [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection). It's not something one needs to know. Toolkits like [ThreeJS](http://threejs.org/) take care of it for you. But maybe some disciplined application could tease 3D things from Creative Lab 5 application. Maybe a few more profile views could be collected.

Ah hell, I was becoming addicted. So it goes, into the small hours of the morning. Setting handle values to 0's results in right angles. Wikipedia described the role of a focal length multiplier. Be aware that if the z coorindate is zero, you'll be dividing by zero. If your z-coordinate is less than zero things are going to turn upside down. And then, suddenly, [something works](https://www.creativelab5.com/s/uNwej3). 
    
![boxillusion][uNwej3]
[live](https://www.creativelab5.com/s/uNwej3). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/uNwej3.js).

---

The basketball was no longer in the tree. It was nowhere to be seen. Sometimes stories just end. Maybe the story could be continued as fiction. A bird took the basketball.

I continued to bounce the white ball everywhere I went. Some of the discoveries were surprising. For instance, strangers would smile and greet. "Hello", "Nice day", and so on. I won't pretend to understand why that was happening. But maybe the reasons is that it's disarming to see someone play. Neurochemical psychological sociology. There is utility in the discovery. One could use it as a confidence trick, if so inclined.

Once, while waiting in a subway station, I was approached by a man. It started out simply enough. Shalom, shalom. About ten minutes later he had $200 of my dollars in his pocket. His baby daughter needed money for medication. He said I could stay in his house in Tel Aviv. He gave me a number I immediately recognized as fake, but I continued to play into his hands. We rode the subway together, in silence. Both of us knew what the other knew. It was an awkard ride.

"What do you do for a living?" He asked me.

"I'm a programmer."

He seemed surprised, "Are you good it?"

"Good luck with your daughter," I said, and got off the train nine stops too early.

---

Equipped with javascript snippets, and [TinyColor](https://bgrins.github.io/TinyColor/), I produce several animations and spam them under the #creativelab5 hashtag. Profile views accumulate, up to a 2335% increase since last month. That number is ridiculous, but I eat it up. Heady days. This serotonin rush is normal. It's what feeds the world.

[live](https://www.creativelab5.com/s/cWcMsq).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/cWcMsq.js).|[live](https://www.creativelab5.com/s/aIZcsx).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/aIZcsx.js).|[live](https://www.creativelab5.com/s/shv7V4).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/shv7V4.js).
:-----------------:|:-----------------:|:-----------------:
![cWcMsq][cWcMsq]  |![aIZcsx][aIZcsx]  |![shv7V4][shv7V4]

---

Then one day, while passing through the park, I find the basketball. It lay hidden in undergrowth. I smiled and picked it up. But something was wrong. It was wet and limp. It had been stabbed. I dropped it, disgusted, and walked away. A few hours later I thought to take a picture of it. Because the basketball was now part of a story. I returned and photographed it. Then I picked it up and dropped it into a garbage can. As it fell into the trash it displaced air. The air stank of dog shit.

![stabbed basketball][brokenball]

---

Suddenly the workflow stopped working. Changes to the localstorage structure no longer persisted across page reloads. Have the Creative Lab staff closed the hole? Was that a hole? When this type of thing happens the answer might be found in the source code. That could be a complicated endeavour, but in this case the code wasn't obfuscated. It was just big and noisy. Chrome dev console slowed to a crawl trying to to display the thing. Text search for 'boardStates', and find:

![this is useful][setstage]

`setStageFromLocal()` ... Was that always there? Invoke the function and the stage populates with the contents of local storage. And, more importantly, it persits across reloads. Why did I not think of looking for this before? What else am I blind to?

The function greatly increases productivity. Updates become instantenous and do not require a page reload. They can even be applied while the animation is running.

Unencumbered, I wonder what the handleIn/handleOut parameters do. From the source code it's apparent that [PaperJS](http://paperjs.org/) is used. A search for "paperjs handlein" provides [documentation about the parameter](http://paperjs.org/reference/segment/#segment). So --- the handles define points on tangent curves. That doesn't mean much to me. An experiment is in order. Write code to arrange tangent points in a circle. The result looks like flowers and leaves. This spawns another run of prototypes. 

[live](hyjJZBH.web) [code](yjJZBH.js)|[live](Diu8WJ.web) [code](Diu8WJ.js)|[live](rnqNpZ.web) [code](rnqNpZ.js)
:--------------:|:--------------:|:--------------:
![yjJZBH][yjJZBH.gif]|![Diu8WJ][Diu8WJ.gif]|![rnqNpZ][rnqNpZ.gif]

---

One of my favorite places to bounce the ball was in culvert under a busy road. One morning I threw the ball down and forward at a sharp angle. It bounced off the ground, then off the ceiling, and then in a counterintuitive direction --- returning to me. That was wonderful. Experimentation implied the phenomenon involved spin imparted by the throw, but more study was necessary.

---

As the number of prototypes increased, common code elements became apparent. All the prototypes, for example, contained functions for accessing the localstorage structure. Those functions could be reused if stored in a single place. The most obvious solution is a dedicated snippet. But then that snippet must be re-run whenever the page is reloaded. That means multiple snippets must be run each time the page is reloaed. And as the number of components grows, the cycle of right-click-run becomes rote. It was again time for an automated solution.

The solution took some effort. It was more complicated than expected. Several technical details became stumbling blocks. I thought to myself, _why am I going to all this trouble_? Surely there was something more worthwhile. My book still needed a lot of work. And then suddenly the local server sprang to life and served without error. A thrill. And, as a bonus, third party libraries could now be easily loaded. Such as [tinycolor](https://bgrins.github.io/TinyColor/) and [smooth.js](https://github.com/osuushi/Smooth.js/).

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

After nearly a week with the ball I'd discovered several ways to throw and catch it. One method is to bounce it forward from behind; then catch it in a downturned palm of the throwing arm. In order for that to work the ball needed to be thrown rather hard. During one attempt it struck a pebble and ricocheted off the path. It landed in the middle of a jeweled bracelet. I would not have found the braclet if it weren't for the ball. My camera's sensor turns the copper and cubic zirconia into gold and diamonds.

![treasure][jewels]

---

A character begins to follow me on Twitter. He is my first follower. He is generous with likes. We enter into an exchange about hidden aspects of the Creative Lab 5 application. Such as the meaning of the six base-2 numbers surrounding the Techno Crab. And the utility of specific fields in a submitted application; for instance `is_hacker` activates the Techno Crab. The field named `rain` is less clear.

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

The upward trend of profile views drops off. My submissions do not collect likes from an persons of influence. Perhaps I overstayed my welcome. The animations probably aren't as neat to others as they are to me. Motivation wanes. The urge to write returns. Writing usually provides insight. I begin recording this story.

![frozen blossoms][frozen]

Freezing rain fell onto the city. Everything became coated by ice. It was caused by setting the rain flag to `true`. I say that because a characteristic of humans is to discern connection and analogy. In this case it is spurious, but the observation lingers. What is to say that there no connection? Maybe it's like the recent discoveries about the [relationship between computational complexity and event horizons](http://www.nature.com/news/theoretical-physics-complexity-on-the-horizon-1.15285). The mathematics of [anti-de sitter space](https://en.wikipedia.org/wiki/Anti-de_Sitter_space) are beyond me, but the thoughts play while I bounce the white ball on bubbles of air under ice.

![bubbleball framecap][bubbleball]
[youtube](https://youtu.be/lo1q3oU93UM)

---

I continued to watch the stream for submissions. Most were bland and uninspired. But occasionally a remarkable one came through. Like [this one](https://creativelab5.com/s/uJclLz) by [@clapinton](https://twitter.com/clapinton)

![escher][escher]

Creations like that are intriguing. How were they made? I wanted to see how they were formed. View Source of a published application to see a `<script>` tag with javascript assigning a dictionary to a variable named `shareData`. This data cannot be extracted as JSON because it contains javascript. That fact took a few tries to understand. The way to read it is to use [javascript eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval). Generally speaking, that's a dangerous thing to do. But in this case it's probably ok. Once the shareData variable is populated into a javascript context, it is becomes a simple matter to copy it into the boardStates structure. Refreshing the stage then shows the animation, where it can be studied.

I use this technique to study the animations of [@zachboth](https://twitter.com/zachboth) and [@clapinton](https://twitter.com/clapinton). They are clever. I'm not sure why that makes me sad. It's likely jealousy.

[@zachboth](https://twitter.com/zachboth)|[@clapinton](https://twitter.com/clapinton)
:--------------------|:---------------------:
![wireboth][wireboth]|![wirepinto][wirepinto]

---

One morning I went to the culvert to experiment with the bounce-back phenomenon. On the first throw the angle was too shallow. It failed to reach the ceiling, and continued forward instead. It bounced a few times, then plopped into the rushing stream. Gone. Anyone watching would have thought I threw it in deliberatly. You could say I did, and it wouldn't change a thing. It was clumsy. All I could think to do was to film the space where the ball was last seen. Somewhere out of the view it was being rolled by the current.

![tunnel where the white ball was lost][tunnel]
[youtube](https://youtu.be/kkN8np7-m-k).

---

The temperature began to climb, then broke into positive numbers. Spring was gaining strenth. The trees shed their coats of ice. Cracking sounds filled the forest. Fragments and sheets came crashing down. It was dangerous. I walked into a stand of trees and stood there, listening to the noise of it all. It's not often one can watch while a world crumbles. A small piece fell from high up and struck my finger. It broke the skin and drew blood. I photographed my bloody finger, and then deleted the photo.

---

I missed that white ball. Spending so much time with it resulted in attachment. Each time I passed the place it was last seen, I would peer into the water and look along the banks. But there was no hope of recovery. Then, one morning, a few blocks past where the white ball as last seen, I found another ball. Day-glo orange, fashioned like a miniature tennis ball. This could be irony, poetry, or coincidence. It was wet and disgusting, but I picked it up anyway. It did not bounce well. It was sad.

I took it with me into a mall and washed it in a sink with liquid hand soap. I patted it with paper towel, then dried it inside a Dyson Airblade. Over the course of the day I would sometimes take it from my pocket and look at it. Silly thing.

![orangeball][orangeball]

---

notes for future development:
- Recollection of being mugged in Windhoek.

[default]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/default.jpg
[bansky]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/bansky.jpg
[tweet]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/tweet.jpg
[both]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/both.jpg
[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png
[simplified]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/simplified.jpg
[snippets]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/snippets.jpg
[500error]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/500error.jpg
[basketball]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/basketball.jpg
[mess]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/mess.jpg
[burst]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/burst.gif
[tunnelbounce]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/tunnelbounce.jpg
[uNwej3]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/uNwej3.gif
[cWcMsq]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/cWcMsq.gif
[aIZcsx]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/aIZcsx.gif
[shv7V4]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/shv7V4.gif
[brokenball]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/brokenball.jpg
[setstage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/setstage.jpg
[yjJZBH.gif]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/yjJZBH.gif
[Diu8WJ.gif]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/Diu8WJ.gif
[rnqNpZ.gif]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/rnqNpZ.gif
[yjJZBF.web]: https://www.creativelab5.com/s/yjJZBH
[Diu8WJ.web]: https://www.creativelab5.com/s/Diu8WJ
[rnqNpZ.web]: https://www.creativelab5.com/s/rnqNpZ
[yjJZBF.js]: https://github.com/goeiebook/creativelab/blob/master/snippets/yjJZBF.js
[Diu8WJ.js]: https://github.com/goeiebook/creativelab/blob/master/snippets/Diu8WJ.js
[rnqNpZ.js]: https://github.com/goeiebook/creativelab/blob/master/snippets/rnqNpZ.js
[jewels]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/jewels.jpg
[rainflag]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/rainflag.jpg
[technocrab]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/technocrab.jpg
[bubbleball]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/bubbleball.jpg
[wireboth]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/wireboth.jpg
[wirepinto]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/wirepinto.jpg
[orangeball]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/orangeball.jpg
[escher]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/escher.jpg
[tunnel]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/tunnel.jpg
[frozen]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/frozen.jpg
