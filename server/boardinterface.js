boardInterface = (function(){

    function apply(shapes) {
        var state = getBoardState();
        state.shapes = shapes;
        putBoardState(state);
        putTimestamp(0);
        board.setStageFromLocal();   
    }

    function getBoardState() {
        return JSON.parse(
            window.localStorage.getItem("boardStates"));
    }

    function putBoardState(state) {
        window.localStorage.setItem("boardStates",
            JSON.stringify(state));
    }

    function putTimestamp(t) {
        window.localStorage.setItem('timestamp', t);
    }

    function getBoardCenter() {
        var size = getBoardSize();

        return {
            x: size.width/2,
            y: size.height/2
        }
    }

    function getRandomPoint() {
        var size = getBoardSize();
        var center = getBoardCenter();

        return {
            x: center.x + Math.random()*size.width - size.width/2,
            y: center.y + Math.random()*size.height - size.height/2,
        }
    }

    function getBoardSize() {
        var state = getBoardState();
        return {
            width: state.originalSize[0],
            height: state.originalSize[1],
        }
    }

    function addShapes(state) {
        var flowers = genFlowers(5);
        state.shapes = flowers;
    }

    return {
        getBoardState: getBoardState,
        getBoardSize: getBoardSize,
        getBoardCenter: getBoardCenter,
        getRandomPoint: getRandomPoint,
        apply: apply
    }

    console.log("board interface created.");
})();
