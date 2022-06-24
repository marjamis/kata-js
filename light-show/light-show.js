const style = document.documentElement.style;

function setLightGlobeColour() {
    r = document.getElementById('red-colour').value
    g = document.getElementById('green-colour').value
    b = document.getElementById('blue-colour').value

    style.setProperty('--' + 'light-globe-color', `rgb(${r}+${g}+${b})`);

    document.getElementById('red-colour-value').innerHTML = r
    document.getElementById('green-colour-value').innerHTML = g
    document.getElementById('blue-colour-value').innerHTML = b
}

function setStrobingOptions() {
    strobing_toggle = document.getElementById('strobing-toggle').checked

    let speed = 0
    if (strobing_toggle == true) {
        speed = 1
    }

    style.setProperty('--' + 'strobing-speed-value', speed + "s");

    document.getElementById('strobing-toggle-value').innerHTML = strobing_toggle
}

function changeMode(type) {
    console.log(`Changing to ${type} mode...`)

    capitalised = `${type}` [0].toUpperCase() + type.substring(1)

    // Not the best implementation but will do for now
    document.body.classList.forEach(item => {
        if (item.match(/^.*-mode/)) {
            current_mode = item;
        }
    })

    document.getElementById('colour-mode').value = `${type}`
    document.body.classList.replace(current_mode, `${type}-mode`)
    document.getElementById('colour-mode').innerHTML = `${capitalised} Mode`
}

[
    document.getElementById('red-colour'),
    document.getElementById('green-colour'),
    document.getElementById('blue-colour'),
].forEach(item => {
    item.addEventListener('input', event => {
        setLightGlobeColour();
    })
})

document.getElementById('strobing-toggle').addEventListener('input', event => {
    setStrobingOptions();
})

document.getElementById('colour-mode').addEventListener('click', event => {
    switch (event.currentTarget.value) {
        case 'light':
            changeMode('dark');
            break;
        case 'dark':
            changeMode('light');
            break;
    }
});