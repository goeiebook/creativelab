Chrome's Dev Console remembers everything you type, including mistakes and typos. This results in a polluted list of suggestions. This was very annoying to me, and I began to search for a remedy. It turns our the remedy is very non-trivial, but while clicking through the menus I stumbled onto the [creativelab5.com](https://creativelab5.com)'s [localstorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) entry. 

![alt text][localstorage]

Pretty-printing the contents of the 'boardStates' key reveals a lot of interesting information. This is the data structure which represents the animation. For example, [this](https://github.com/goeiebook/creativelab/blob/master/json/defaultBoardStates.json) is the default page shown at startup. Naturally one begins to wonder what would happen if you modified this structure. 

[localstorage]: https://raw.githubusercontent.com/goeiebook/creativelab/master/images/localstorge.png "Local storage dev console"