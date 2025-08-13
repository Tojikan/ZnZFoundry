let token = canvas.tokens.controlled[0];

if (!token.light){
    token.document.update({
        light: {
            bright: 15,
            dim: 30,
            color: '#000000',
            angle: 90
        }
    });
} else {
    token.document.update({
        light: {
            bright: 0,
            dim: 0,
            color: '#000000',
            angle: 90
        }
    });
}