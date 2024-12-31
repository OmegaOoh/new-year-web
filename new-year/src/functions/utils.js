export function drawBackground(canvas, style) {
    if (!canvas) return;
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bubbles = []

    function createBubble() {
        const size = Math.random() * 20 + 10
        const x = Math.random() * canvas.width
        const y = canvas.height + size
        const speed = Math.random() * 2 + 1
        bubbles.push({ x, y, size, speed })
    }

    function updateBubbles() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < bubbles.length; i++) {
            const bubble = bubbles[i]
            bubble.y -= bubble.speed
            context.beginPath()
            context.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
            context.fillStyle = style
            context.fill()
            context.closePath()
            if (bubble.y + bubble.size < 0) {
            bubbles.splice(i, 1)
            i--
            }
        }
    }

    function animate() {
        updateBubbles()
        requestAnimationFrame(animate)
    }

    setInterval(createBubble, 250)
    animate()
}