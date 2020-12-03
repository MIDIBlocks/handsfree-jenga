// Instantiate Handsfree.js using the hand model
// @see https://handsfree.js.org/docs/hand/
const handsfree = new Handsfree({hand: true})

/**
 * This is how you plug into the main game loop
 * - pinchClick is the name of the hook, which is accessed through handsfree.plugin.pinchClick
 * 
 * @see https://handsfree.js.org/docs/#adding-functionality
 */
handsfree.use('pinchClick', {
  config: {
    // Number of pixels that the finger/thumb tips must be within to trigger a click
    // Too low a value will not work due to errors
    pinchDistance: 40,

    // Number of frames after a release is detected to still consider as a drag (helps with tracking errors)
    numErrorFrames: 5
  },

  // Are the fingers pinched?
  pinched: false,
  // Have the fingers been released?
  released: false,
  // Whether the finger/thumb are considered pinched
  pinchThresholdMet: false,
  // Number of frames after a click is NOT detected to actually release the click (helps with errors)
  numErrorFrames: 5,

  /**
   * Detect click state and trigger a real click event
   */
  onFrame({ hand }) {
    // Bail if no detection
    if (!hand || !hand.annotations) return

    // Detect if the thumb and indexFinger are pinched together
    const a = hand.annotations.indexFinger[3][0] - hand.annotations.thumb[3][0]
    const b = hand.annotations.indexFinger[3][1] - hand.annotations.thumb[3][1]
    const c = Math.sqrt(a*a + b*b)
    this.pinchThresholdMet = c < this.config.pinchDistance

    // Count number of frames since last pinch to help with errors
    if (this.pinchThresholdMet) {
      this.numErrorFrames = 0
    } else {
      ++this.numErrorFrames
    }

    // Simulate a mousemove (moving the block)
    if (this.pinched && this.numErrorFrames < this.config.numErrorFrames) {
      hand.pointer.state = 'mousemove'
    }

    // Simulate a mousedown (selecting a block)
    if (this.pinchThresholdMet && !this.pinched) {
      this.pinched = true
      this.released = false
      document.body.classList.add('handsfree-clicked')
      hand.pointer.state = 'mousedown'
    }

    // Simulate a mouseup (unpinch)
    if (!this.pinchThresholdMet && !this.released && this.numErrorFrames < this.config.numErrorFrames) {
      this.pinched = false
      this.released = true
      document.body.classList.remove('handsfree-clicked')
      hand.pointer.state = 'mouseup'
    }

    // Dispatch events
    window.renderer && hand.pointer.state && this.dispatchEvent(hand)
  },

  /**
   * The actual click method, this is what gets throttled
   */
  dispatchEvent(hand) {
    const $el = document.elementFromPoint(hand.pointer.x, hand.pointer.y)
    if ($el) {
      window.renderer.domElement.dispatchEvent(
        new MouseEvent(hand.pointer.state, {
          bubbles: true,
          cancelable: true,
          clientX: hand.pointer.x,
          clientY: hand.pointer.y
        })
      )
      hand.pointer.$target = $el
    }
  }
})







// 👍 You can ignore everything below
// The only important bit is that you should use handsfree.start() to actually start tracking








/**
 * Starts Handsfree.js and the Jenga project when the button is clicked
 * - You typically only need handsfree.start()
 * 
 * - This requires a little extra setup because Handsfree.js currently doesn't load dependencies
 *   until they are needed (in this case Three.js is used to calculate where you're grabbing).
 *   Because I can't render the Jenga game until Three.js is loaded, we just load everything onStart
 */
function startHandsfree () {
  handsfree.start()

  // Load the Jenga game
  document.addEventListener('handsfree-modelLoaded', function () {
    loadDep('assets/jenga/stats.min.js')
    loadDep('assets/jenga/physi.js',
      () => {loadDep('assets/jenga/TrackballControls.js',
        () => {loadDep('assets/jenga/jenga.js')})})
  })
}

/**
 * Helper for loading dependencies sequentially
 */
function loadDep (src, callback) {
  const $script = document.createElement('script')
  $script.src = src + '?v=' + Math.random()

  if (callback) {
    $script.onload = callback
  }
  
  document.body.appendChild($script)
}