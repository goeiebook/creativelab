Chrome's Dev Console remembers everything you type. This includes mistakes and typos, so pretty soon the suggestion list becomes polluted. The remedy is nontrivial, and while attempting to do so I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

![alt text][localstorage]

Pretty-printing the contents of the 'boardStates' key reveals a lot of interesting information. It is the data structure which represents the animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page shown at startup. Naturally one begins to wonder what happens when you modify this structure. 

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"