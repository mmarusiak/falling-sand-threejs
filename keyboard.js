export const pressedKeys = {};

window.onkeyup = function(e){
    pressedKeys[e.keyCode] = false;
};

window.onkeydown = function(e){
    pressedKeys[e.keyCode] = true;
};