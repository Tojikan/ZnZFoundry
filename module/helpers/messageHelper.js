export function sendGreenMessage(msg, isError, actor){
    let color = "#abf7b1";
    if (isError){
        color = "#ff9e9e";
    }
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div style='background-color:${color}'>${msg}</div>`,
    });
}

export function sendYellowMessage(msg, actor){
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div style='background-color:#f7f9ab'>${msg}</div>`,
    });
}

export function sendRedMessage(msg, actor){
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div style='background-color:#ff9e9e'>${msg}</div>`,
    });
}