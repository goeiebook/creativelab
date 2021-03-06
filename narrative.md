## Discovery Requires Circumstance
    
Stories begin somewhere. Nobody was looking at my work. I created a Twitter account because marketing seemed necessary. As a consequence I read [a retweet](https://twitter.com/PRHDigital/status/707503572733313024) via @editionsatplay. It mentioned a program looking for new applicants.
    
![the application site][default]
    
A one year paid experience, [the application](https://creativelab5.com) is a web application, "*Write it, design it, code it, move it, break it.*" The form contained a checkbox for wildcards. View Source revealed a secret puzzle. [Solving the puzzle](https://github.com/mhipley/creativelab5/wiki/The-Google-Creative-Lab-5-Cheat-Sheet) awarded a "Techno Crab" badge. The badge supposedly activated a pen tool but I couldn't get it to work. Maybe that was part of the challenge. I made an animation titled "Idempotent", and sent it off.
    
Idempotent. So clever. A shoo-in for sure.
    
A day elapsed. Then another. I discovered my animation was [broken](https://www.creativelab5.com/s/puukkz). It didn't play correctly and the console showed an error. I didn't mean to do that. It looked terrible. I addressed a tweet to one of the designers asking, "Does this count as breaking it?" A response arrived. 
    
![the response][tweet]
    
That was confusing. Maybe I hadn't used the correct terminology. But then something unanticipated happened: attention. Profile views and tweet impressions. Twitter analytics measured an increase of 1000%.
    
---
    
Winter was finally coming to a close. The snow melted. When snow goes away it leaves a distinctive aftermath. Piles of gravel, salt, and soggy cigarette butts. Glacial till with snowplow scars and single mittens.
    
In a pile of detritus was a white ball. I picked it up. Solid rubber with a grey splotch. A lot of bounce. Probably a dog toy. I put it in my pocket. I thought [_tweet about this_](https://twitter.com/goeiebook/status/709378927219728384), and formed a plan to keep the ball close at all times. Because doing so increases the chances of discovering something new.
    
---

The 1000% percent increase in views wasn't impressive considering it came from zero. But it was big to me. Checking analytics was fun when signal dominated noise. [The alternative is not][bansky]. I followed new submissions with a competitive eye. Most were bland, like mine; but none were broken, like mine. And none had the Techno Crab stamp. I felt like king of the creativelab5 hashtag. Then [this](https://www.creativelab5.com/s/pnMGi5) was published.
    
![the both submission][both]
    
Excellent presentation, casual phrasing, and three images demonstrating aspects of design. And somehow it included new shapes. I darkened. How could this have been made if the pen tool did not work?
    
Stay cool, Abrie. You could learn a lot from experts like this.
    
Immediately I opened the site and looked deeper. There was a tool called anchor, but I wasn't able to get that to work either. The tiny vertex manipulators were aggravating. The play bar disappeared at inconvienent times and reappeared when least expected. Heavy CPU usage made the computer whine. But there had to be a way to work around the problems. Others had found a way, anyway.
    
For insight into sites, the dev console is the window. The [Chrome Dev Console](https://developer.chrome.com/devtools/docs/console) remembers everything entered, including mistakes and typos. At first this was helpful, but then became pollution. Annoyed, I clicked through the menus looking for a remedy. And, as it turns out, the remedy is non-trivial. But the search took me to the [Resources Panel](https://developers.google.com/web/tools/chrome-devtools/iterate/manage-data/), which has an entry named [Local Storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage), and within that was an interesting string.
    
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
    
Inefficient, but already better than nothing. Then somewhere between the refreshes, I accidently clicked the canvas and drew a line. The pen tool had started working. Maybe an unannounced bug bug fix had been deployed. Too late to turn back now.

---
    
I'd been in the coffee shop for an hour, and decorum suggested it was time to leave. Time to walk to another shop. The route goes through a park. Spring was near. Two kids were throwing a boomerang. Clearly they did not know what they were doing. "This thing sucks!" said one. I approached them and said "Could I show you how to throw that?" They handed it over. After daying something about not having thrown a boomerang in a long time, I threw it. It went in a perfect arc, and I caught it. I'd never caught a boomerang before. "Wow!" said the kids. I handed the boomerang back, "Now you try." The kid copied my technique and it flew out in a wide arc, curved up, around --- and then got stuck in a tree.
    
---
    
Because the animation data was editable it meant the UI could be avoided. But editing the structure by manual copy-pasting was tiring and error-prone. A more programmatic workflow was needed. The dev console's command prompt could help. A series of commands like this, for example, created a function for erasing all the shapes:
    
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
    
The page had to be reloaded to show changes. Reloading the page destroyed the javascript context. Therefore the functions needed to be re-entered on every reload. So it had become another copy-paste routine, but in a slightly different domain. Looking for a solution turned up: [Snippets](https://developers.google.com/web/tools/chrome-devtools/debug/snippets/?hl=en)!
    
![the snippets panel][snippets]
    
Now we're talking. Right-click &rarr; Run. That's fun. I went wild, like a bull in a china shop, ignoring DRY and other rules of thumb. The code created arrays of shapes and colors. What did those handleIn/handleOut parameters do? Whatever it was, the result was interesting. Excessive and messy. Code without understanding.
    
![what a mess][mess]
    
I was proud of it. It seemed worthy of submission. I clicked the button, signed the "Cover Letter", and waited for the request to complete. The request took a long time, then returned an empty error response. Tried again. Failure again. [500 Server Error](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error). So the animation worked locally, but was trapped there. Unshareable. I must have discovered another "Break It" feature! I tweeted to the #creativelab5 people, expecting another 1000% increase in profile views.
    
![what a mess][500error]
    
---
    
The following morning I passed the tree that caught the boomerang. The boomerang wasn't there anymore. But there was a basketball up there. 
    
![boomerang replacement][basketball]
    
I laughed aloud. Amused by automatic stories. This one had fractal similarity. I mean, this scene is like the Peanuts' [kite-eating tree](http://peanuts.wikia.com/wiki/Kite-Eating_Tree). Those were my thoughts while I bounced the white ball. I wondered what would happen the next day. There could be another good turn in the story.
    
---
    
The post about the 500 Error did not generate buzz. No replies, no tweet impressions, no link clicks. Maybe it wasn't anything unexpected. That is to say: the error was returned because the submission was unacceptable. And that would be expected.

Edit the snippet. Reduce complexity and resubmit. Repeat until the submission goes through. Eventually it does. That proves it. The problem was invalid timeline values and too many shapes. A constraint on animation complexity. Reasonable, in retrospect. Embarassing too.
    
Begin again with a clean snippet. Generate a random set of coordinates. Add some random handleIns and handleOuts. Multiply by trigometric functions. Divide by a constant value. The result were fireworks. It looked like fireworks. How it worked was not completely clear. But to an outsider it would seem designed. 
    
![burst][burst]
[live](https://www.creativelab5.com/s/31KE8L). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/31KE8L.js).
    
---
    
Discoveries involving the ball began three days after I found it. Aside from becoming better at manipulating it, I also became familiar with particular details. Such as the sound made when bounced in different environments. It went _splat_ when it landed in a puddle (which also substantially reduced the return energy). It produced beautiful long reverberations when bounced on a culvert sidewalk.
    
![spectrogram of a tunnel bounce][tunnelbounce]
[youtube](https://youtu.be/8KXGaB3PApY).

---
    
Dividing two-dimensional coordinates by a third number is called foreshortening. I learned that reading about [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection). It's not something one needs to know. Toolkits like [ThreeJS](http://threejs.org/) take care of it for you. But maybe applying it in a disciplined manner could tease 3D things from Creative Lab 5 application. Maybe a few more profile views could be collected.

Ah hell, I was becoming addicted. So it goes, into the small hours of the morning. Setting handle values to 0's will make sharp angles. Wikipedia described the role of a focal length multiplier. Be aware that if the z coorindate is zero, you'll be dividing by zero. If your z-coordinate is less than zero things are going to turn upside down. And then, suddenly, something worked. 
    
![boxillusion][uNwej3]
[live](https://www.creativelab5.com/s/uNwej3). [code](https://github.com/goeiebook/creativelab/blob/master/snippets/uNwej3.js).

---

The basketball was no longer in the tree. It was nowhere to be seen. Sometimes stories just end. Maybe the story could be continued as fiction. A bird took the basketball.

The white ball accompanied me everywhere. Sometimes it revealed surprising things. For instance, strangers would smile and greet. "Hello", "Nice day", and so on. I do not pretend to understand why that was happening. But maybe the reason is that it's disarming to see someone play. Neurochemical psychological sociology. It could be used as a confidence trick, if one were so inclined.

Once, while waiting in a subway station, I was approached by a man. It started out simply enough: Shalom. Shalom. About ten minutes later he had $200 of my dollars in his pocket. His baby daughter needed money for medication. He said I could stay in his house in Tel Aviv. He gave me a number I immediately recognized as fake, but I continued to play into his hands. We rode the subway together, in silence. Both of us knew what the other knew. It was awkard.

"What do you do for a living?" He asked me.

"I'm a programmer."

He seemed surprised, "Are you good it?"

"Good luck with your daughter," I said, and got off the train nine stops too early.

---

Equipped with javascript snippets, and [TinyColor](https://bgrins.github.io/TinyColor/), I produced several prototypes and used them to spam the #creativelab5 hashtag. Profile views accumulated. A 2335% increase since last month. A ridiculous number, but I ate it up. Heady days. Serotonin rushes are normal. They feed the world.

[live](https://www.creativelab5.com/s/cWcMsq).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/cWcMsq.js).|[live](https://www.creativelab5.com/s/aIZcsx).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/aIZcsx.js).|[live](https://www.creativelab5.com/s/shv7V4).[code](https://github.com/goeiebook/creativelab/blob/master/snippets/shv7V4.js).
:-----------------:|:-----------------:|:-----------------:
![cWcMsq][cWcMsq]  |![aIZcsx][aIZcsx]  |![shv7V4][shv7V4]

---

Then I found the basketball. It was hidden in undergrowth. I smiled and picked it up. But something was wrong. It was wet and limp. It had been stabbed. I dropped it, disgusted, and walked away. A few hours later I thought to take a picture of it. Because the basketball was part of a story. I returned to where it lay and photographed it. Then I picked it up and dropped it into a garbage can. When it fell into the trash it displaced air. The air stank of dog shit.

![stabbed basketball][brokenball]

---

The workflow stopped working. Changes to the localstorage structure no longer persisted across reloads. Did the Creative Lab close a hole? Was there a hole? When this type of thing happens the thing to do is look at the source code. Sometimes that's a complicated endeavour. But in this case the code wasn't obfuscated. Clearly it wasn't a secret.

Text search for 'boardStates', and find:

![this is useful][setstage]

`setStageFromLocal()` ... Was that always there? Invoke the function and the stage populates with the contents of local storage. And the changes persited across reloads. Why did I not think to look for this before? What else was I blind to?

The function greatly increased productivity. Updates were instantenous and did not require reloads. They could even be applied while the animation was running.

Instant feedback encouraged experimentation. I wondered what the handleIn/handleOut parameters did. The source code contained references to [PaperJS](http://paperjs.org/). A search for "paperjs handlein" provided a link to [documentation about the parameter](http://paperjs.org/reference/segment/#segment). So --- the handles defined points on tangent curves. But the application of that wasn't clear. An experiment was necessary. Write code to arrange tangent points in a circle. The results looked like flowers and leaves. That spawned a series of prototypes. 

[live](hyjJZBH.web) [code](yjJZBH.js)|[live](Diu8WJ.web) [code](Diu8WJ.js)|[live](rnqNpZ.web) [code](rnqNpZ.js)
:--------------:|:--------------:|:--------------:
![yjJZBH][yjJZBH.gif]|![Diu8WJ][Diu8WJ.gif]|![rnqNpZ][rnqNpZ.gif]

---

Bouncing the ball through a culvert tunnel was one of my favorite things. One morning I threw the ball forward and downward at a sharp angle. It bounced up, struck the ceiling, and bounced back toward me. The reversal of direction was counterintuitive. Surprises of such caliber are rare. It was wonderful. Experimentation implied the phenomenon involved spin imparted during the throw, but more study was necessary.

---

As the number of prototypes increased, common code elements became apparent. All the prototypes, for example, contained functions for accessing the localstorage structure. Those functions could be reused if stored in a single place. The natural soultion was to put shared code in a dedicated snippet. But then that snippet would need to be re-run whenever the page was reloaded. And as the number of snippets grew, the amount of right-click-runs became excessive. The time was right for a new solution.

The solution took some effort. It was more complicated than expected. Several technical details became stumbling blocks. I thought to myself, _why am I going to all this trouble_? Surely there was something more worthwhile. My book still needed a lot of attention. And then suddenly the local server sprang to life and served without error. A thrill. And, as a bonus, it could be used to load third party libraries such as [tinycolor](https://bgrins.github.io/TinyColor/) and [smooth.js](https://github.com/osuushi/Smooth.js/).

This is the snippet that interfaced with a local server:

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

Using it required: [simple-https-server.py](https://raw.githubusercontent.com/goeiebook/creativelab/master/server/simple-htps-server.py), [chrome-csp-disable](https://github.com/PhilGrayson/chrome-csp-disable) and a self-signed certificate.

---

After nearly a week with the ball I'd discovered several ways to throw and catch it. One method was to bounce it forward from behind; then catch it in a downturned palm of the throwing arm. In order for that to work the ball needed to be thrown with force. During one attempt it struck a pebble and ricocheted off the path. It landed where a jeweled bracelet lay hidden in the grass. A material discovery. The bracelet was worthless, but my camera's sensor turned the copper and cubic zirconia into gold and diamonds.

![treasure][jewels]

---

A character began to follow me on Twitter. He was my first real follower. He was generous with likes. We entered into an exchange about hidden aspects of the Creative Lab 5 application. Such as the meaning of the six base-2 numbers surrounding the Techno Crab. And the utility of specific fields in a submitted application. For instance `is_hacker` activates the Techno Crab, but there was also a field named `rain` which did not have an obvious purpose.

Techno|Rain
:--------------:|:--------------:
![technocrab][technocrab]|![set rain to try][rainflag]

The message around the crab logo spells TECHNO. The rain flag could be set to true by using the following code before submitting.

```javascript
var boardState = JSON.parse(
    window.localStorage.getItem('boardStates'));

extras['rain'] = true;
boardState.rain = true;

window.localStorage.setItem('boardStates',
    JSON.stringify(boardState));
```

But setting the rain flag to true did not appear to have any effect. I did not examine the subject further.

---

The upward trend of profile views stopped. The tweets did not attract comment or significant engagement. Perhaps I had overstayed my welcome. Motivation waned. It was a downturn. Then the urge to write returned. Writing usually provided insight. I began recording this story.

![frozen blossoms][frozen]

Freezing rain fell onto the city. Everything became coated with ice. Spring ground to a halt. All of it was happening because I had set the rain flag to `true`. I say that because a characteristic of humans is to discern connection and analogy. It was spurious, but the observation lingered. I bounced the ball over a wooden bridge. What was to say that there was no connection? Maybe there was an analogy with discoveries about [scrambling](http://arxiv.org/abs/1111.6580) or [computational complexity and event horizons](http://www.nature.com/news/theoretical-physics-complexity-on-the-horizon-1.15285). The mathematics of [anti-de sitter space](https://en.wikipedia.org/wiki/Anti-de_Sitter_space) seem impenetrable. The thoughts played while I bounced the white ball on bubbles of air under ice.

![bubbleball framecap][bubbleball]
[youtube](https://youtu.be/lo1q3oU93UM)

---

New submissions continued to flow onto twitter. Sometimes a remarkable one came through. Like [this one](https://creativelab5.com/s/uJclLz) by [@clapinton](https://twitter.com/clapinton)

![escher][escher]

Creations like that are intriguing. How were they made? I wanted to see what was inside them. View Source of a published application to see a `<script>` tag with javascript assigning a dictionary to a variable named `shareData`. This data cannot be extracted as JSON because it contains javascript. That fact took a few tries to understand. The way to read it is to use [javascript eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval). Generally speaking, that's a dangerous thing to do. But in this case it was probably ok. Once the `shareData` variable is available to the javascript context, it becomes a simple matter to copy it into the boardStates structure. Refreshing the stage then shows the animation, where it can be studied.

I used this technique to study the animations of [@zachboth](https://twitter.com/zachboth) and [@clapinton](https://twitter.com/clapinton). They are clever. I'm not sure why that makes me sad. Likely jealousy.

[@zachboth](https://twitter.com/zachboth)|[@clapinton](https://twitter.com/clapinton)
:--------------------|:---------------------:
![wireboth][wireboth]|![wirepinto][wirepinto]

[reverse engineer](https://github.com/goeiebook/creativelab/blob/master/snippets/reverse.js)

---

One morning I went to the culvert to experiment with the bounce-back phenomenon. On the first throw the angle was too shallow. The ball did not reach the ceiling. It bounced forward, out of the tunnel, and plopped into the rushing stream. Gone. Anyone watching would have thought it was intentional. If it was or was not, it could not change a thing. It was clumsy. All I could think to do was to film where the ball was last seen. As the film rolled, the ball was underwater.

![tunnel where the white ball was lost][tunnel]
[youtube](https://youtu.be/kkN8np7-m-k).

---

The temperature began to climb, then broke zero. Spring gained strength. Trees shed their coats of ice. Cracking sounds filled the forest. Fragments and sheets came crashing down. It was dangerous. I walked into a stand of trees and stood there, listening to the noise of it all. It's not often one can watch while a world crumbles. A small piece fell from high up and struck my finger. It broke the skin and drew blood. I photographed my bloody finger, then deleted the photo.

---

I missed the company of the white ball. That was the final discovery --- that spending many hours with a thing results in attachment. Or maybe less a discovery than a reminder of things already learned. Whenever I passed the place it was last seen, I would peer into the water and look along the banks. But there was no hope of recovery.

Then, one morning, a few blocks away, I found a different ball. It was day-glo orange, fashioned like a miniature tennis ball. It could be irony or poetry. It was wet and disgusting, but I picked it up anyway. It did not bounce well.

I took it with me to a mall and washed it with liquid soap in a bathroom sink. I patted it with paper towel, then dried it with a Dyson Airblade.

Sometimes I take it from my pocket and look at it. Silly thing. Just a coincidence.

![orangeball][orangeball]

---

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
