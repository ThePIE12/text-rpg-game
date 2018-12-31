// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote
const fs = require('fs')
const path = require('path')
const $ = jquery = require('./js/jquery-3.3.1.min.js')

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
      handleWindowControls()
      InitButtons()
      InitShell()
    }
}

Element.prototype.remove = function() {
  console.log('Element deleted!')
  console.log(this)
  this.parentElement.removeChild(this)
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  console.log('Element deleted!')
  console.log(this)
  for(let i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i])
    }
  }
}

function animate({duration, draw, timing}) {

  let start = performance.now()

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) timeFraction = 1

    let progress = timing(timeFraction)

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }

  })
}

function Sleep (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function InitButtons() {

}

function InitShell() {
  let InputShell = document.getElementById('InputShell')
  for (let i = 0; i < InputShell.length; i++) {
    if (InputShell[i].tagName == 'INPUT') {
      InputShell = InputShell[i]
      break
    }
  }

  InputShell.addEventListener('keydown', e => {
    ShellParseKeyInput(e)
  })
}

function handleWindowControls() {
  // When document has loaded, initialise
  let window = remote.getCurrentWindow()
  const minButton = document.getElementById('min-button'),
        maxButton = document.getElementById('max-button'),
        restoreButton = document.getElementById('restore-button'),
        closeButton = document.getElementById('close-button')

  minButton.addEventListener('click', event => {
    window = remote.getCurrentWindow()
    window.minimize()
  })

  maxButton.addEventListener('click', event => {
    window = remote.getCurrentWindow()
    window.maximize()
    toggleMaxRestoreButtons()
  })

  restoreButton.addEventListener('click', event => {
    window = remote.getCurrentWindow()
    window.unmaximize()
    toggleMaxRestoreButtons()
  })

  // Toggle maximise/restore buttons when maximisation/unmaximisation
  // occurs by means other than button clicks e.g. double-clicking
  // the title bar:
  toggleMaxRestoreButtons()
  window.on('maximize', toggleMaxRestoreButtons)
  window.on('unmaximize', toggleMaxRestoreButtons)

  closeButton.addEventListener('click', event => {
    window = remote.getCurrentWindow()
    window.close()
  })
  function toggleMaxRestoreButtons() {
    window = remote.getCurrentWindow()
    if (window.isMaximized()) {
      maxButton.style.display = 'none'
      restoreButton.style.display = 'flex'
    } else {
      restoreButton.style.display = 'none'
      maxButton.style.display = 'flex'
    }
  }
}


var CurrentCommand = ''
var PrevCommands = []
var CurrentIndex = 0
function ShellParseKeyInput (e) {
  let InputShell = document.getElementById('InputShell').childNodes,
      OutputShell = document.getElementById('OutputShell')
  for (let i = 0; i < InputShell.length; i++) {
    if (InputShell[i].tagName == 'INPUT') {
      InputShell = InputShell[i]
      break
    }
  }


  if (e.key == 'Enter') {
    PrevCommands = [...PrevCommands, InputShell.value]
    CurrentIndex = PrevCommands.length
    if (PrevCommands[CurrentIndex - 1].trim() == '')
      PrevCommands.pop()

    CurrentCommand = ''

    parseCommand(InputShell.value)
    InputShell.value = ''

  } else if (e.key == 'ArrowUp') {
    if (CurrentIndex == PrevCommands.length)
      CurrentCommand = InputShell.value
    if (CurrentIndex > 0)
      CurrentIndex--
    if (typeof PrevCommands[CurrentIndex] === 'string')
      InputShell.value = PrevCommands[CurrentIndex]

  } else if (e.key == 'ArrowDown') {
    if (CurrentIndex < PrevCommands.length)
      CurrentIndex++
    if (typeof PrevCommands[CurrentIndex] === 'string')
      InputShell.value = PrevCommands[CurrentIndex]
    else if (CurrentIndex == PrevCommands.length)
      InputShell.value = CurrentCommand
  }
}

function parseCommand(command) {
  let OutputShell = document.getElementById('OutputShell')
  OutputShell.value += `\n> ${command}`
  command = command.toLowerCase().split(' ')

  switch (command[0]) {
    case 'hello':
      OutputShell.value += '\nWorld!'
      break
  }
}
