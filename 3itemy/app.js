const canvas = document.querySelector('canvas');
const app = canvas.getContext('2d');

const collisionMap = []
for (let i = 0; i < collision.length; i += 40) {
    collisionMap.push(collision.slice(i, 40 + i))
}

class Boundary {
    static width = 64;
    static height = 64;
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64

    }

    draw(){
        app.fillStyle = 'rgba(255, 0, 0, 0)'
        app.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = {
    x: -1095,
    y: -1420
}

collisionMap.forEach((row, i) => {
    row.forEach((symbol, j) =>{
        if (symbol === 5)
        boundaries.push(
            new Boundary({
            position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }
        }))
    })
})


const image = new Image()
image.src = './img/bg1.png'

const playerDownImage = new Image()
playerDownImage.src = './img/char1.png'

const playerUpImage = new Image()
playerUpImage.src = './img/char1up.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/char1left.png'

const playerRightImage = new Image()
playerRightImage.src = './img/char1right.png'

class Sprite {
    constructor({position, velocity, image, frames = { max: 1}, sprites }){
        this.position = position;
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw(){
        app.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )

        if (!this.moving) return

            if (this.frames.max >1){
                this.frames.elapsed++
            }
            if (this.frames.elapsed % 10 === 0) {
                if (this.frames.val < this.frames.max -1) this.frames.val++
                else this.frames.val = 0
            }
    }
}



const player = new Sprite({
    position: {
        x: canvas.width / 2 - 72 / 4 / 2,
        y: canvas.height / 2 - 24 / 2
    },
    image: playerDownImage,
    frames: {
        max: 3
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

// position bacground image
const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    } 
}

const movebles = [background, ...boundaries]

function rectangularCollision ({rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x && rectangle1.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    player.draw()
    
    let moving = true
    player.moving = false
    if(keys.ArrowUp.pressed && lastKey === 'ArrowUp'){
        player.moving = true
        player.image = player.sprites.up
        for (let i =0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { 
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 2
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            }
        
        if (moving)
        movebles.forEach((movable) => {
             movable.position.y += 2
        })
    }else if(keys.ArrowDown.pressed && lastKey === 'ArrowDown'){
        player.moving = true
        player.image = player.sprites.down
        for (let i =0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { 
                        ...boundary,
                        position: {
                            x: boundary.position.x + 2,
                            y: boundary.position.y 
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            }
        if (moving)    
        movebles.forEach((movable) => {
                movable.position.y -= 2
        })
    }else if(keys.ArrowLeft.pressed && lastKey === 'ArrowLeft'){
        player.moving = true
        player.image = player.sprites.left
        for (let i =0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { 
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 2 
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            }
        if (moving)
        movebles.forEach((movable) => {
                movable.position.x += 2
        })
    }else if(keys.ArrowRight.pressed && lastKey === 'ArrowRight'){
        player.moving = true
        player.image = player.sprites.right
        for (let i =0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: { 
                        ...boundary,
                        position: {
                            x: boundary.position.x - 2,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            }
        if (moving)
        movebles.forEach((movable) => {
            movable.position.x -= 2
        })
        }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) =>{
    switch(e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break   
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break  
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break    
    }
});
window.addEventListener('keyup', (e) =>{
    switch(e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break   
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break  
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break    
    }
});