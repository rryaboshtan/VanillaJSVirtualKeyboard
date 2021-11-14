const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        typingShow: null,
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },
    properties: {
        value: '',
        capsLock: false,
    },

    init() {
        this.elements.main = document.createElement('div')
        this.elements.keysContainer = document.createElement('div')
        this.elements.main.classList.add('keyboard', 'keyboard--hidden')
        this.elements.keysContainer.classList.add('keyboard__keys')
        this.elements.keysContainer.appendChild(this._createKeys())

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key')

        this.elements.main.appendChild(this.elements.keysContainer)
        document.body.appendChild(this.elements.main)

        this.elements.typingShow = document.querySelector('.use-keyboard-input')
    },
    _createKeys() {
        const fragment = document.createDocumentFragment()
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "close", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ]

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button')

            keyElement.setAttribute('type', 'button')
            keyElement.classList.add('keyboard__key')

            switch (key) {
                case 'backspace':
                    this.renderKeyElWithOneClass(keyElement, 'keyboard__key--wide', '<--')

                    keyElement.addEventListener('click', () => {
                        this.properties.value =
                            this.properties.value.substring(0, this.properties.value.length - 1)
                        this.outputTypingValue()
                    })
                    break
                case 'caps':
                    this.renderKeyElWithTwoClasses(keyElement, 'keyboard__key--wide', 'keyboard__key--activatable', 'caps')

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle('keyboard__key--active')
                        this.elements.typingShow.value = this.properties.value
                    })
                    break
                case 'enter':
                    this.addStyleWithListener(keyElement, 'keyboard__key--wide', 'enter', '\n')
                    break
                case 'space':
                    this.addStyleWithListener(keyElement, 'keyboard__key--extra-wide', 'spacebar', ' ')
                    break
                case 'close':
                    this.renderKeyElWithTwoClasses(keyElement, 'keyboard__key--wide', 'keyboard__key--dark', 'close')

                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('onclose')
                        this.close()
                    })
                    break
                default:
                    keyElement.textContent = key.toLowerCase()

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                        this.outputTypingValue()
                    })
                    break
            }
            fragment.appendChild(keyElement)
            if (this.isLineBreak(key)) {
                fragment.appendChild(document.createElement('br'))
            }
        })

        return fragment
    },
    isLineBreak(key) {
        return (["backspace", "p", "enter", "?"].indexOf(key) !== -1)
    },
    addStyleWithListener(keyElement, styleClass, textContent, value) {
        this.renderKeyElWithOneClass(keyElement, styleClass, textContent)

        keyElement.addEventListener('click', () => {
            this.properties.value += value
            this.outputTypingValue()
        })
    },
    renderKeyElWithOneClass(keyElement, styleClass, textContent) {
        keyElement.classList.add(styleClass)
        keyElement.textContent = textContent
        // console.log('TYPEOF', Array.isArray(this.elements.keys))
    },
    renderKeyElWithTwoClasses(keyElement, styleClass, styleClass2, textContent) {
        keyElement.classList.add(styleClass, styleClass2)
        keyElement.textContent = textContent
    },
    outputTypingValue() {
        this._triggerEvent('oninput')
        this.elements.typingShow.value = this.properties.value
    },
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value)
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock

        for (let key of this.elements.keys) {
            key.textContent = this.notControlKey(key) ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
        }
    },
    notControlKey(key) {
        const controlKeys = ["caps", "close", "enter", "spacebar"]
        return (controlKeys.indexOf(key.innerHTML) === -1
            && this.properties.capsLock)
    },
    open(initialValue, oninput, onclose, methodName = 'remove') {
        this.properties.value = initialValue || ''
        this.eventHandlers.oninput = oninput
        this.eventHandlers.onclose = onclose
        this.elements.main.classList[methodName]('keyboard--hidden')
    },
    close() {
        this.open('', null, null, 'add')
    },
}

window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init()
    Keyboard.open('', (currentValue) => console.log(`Current ${currentValue}`),
        (currentValue) => console.log(`Keyboard closed! Finish value: ${currentValue}`)
    )
})