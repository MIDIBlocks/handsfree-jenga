/**
 * Replaces pinchClick to use mousedown/mouseup events
 */
handsfree.use('pinchClick', {
  config: {
    // Number of pixels that the finger/thumb tips must be within to trigger a click
    pinchDistance: 40,

    // Number of frames after a click is NOT detected to actually release the click (helps with errors)
    numErrorFrames: 5
  },

  // Number of frames mouse has been downed
  mouseDowned: false,
  // Has the mouse been released
  mouseUpped: false,
  // Whether one of the morph confidences have been met
  thresholdMet: false,
  // Number of frames after a click is NOT detected to actually release the click (helps with errors)
  numErrorFrames: 5,

  onUse() {
    this.throttle(this.config.throttle)
  },

  /**
   * Maps .maybeClick to a new throttled function
   */
  throttle(throttle) {
    this.maybeClick = this.handsfree.throttle(
      function(hand) {
        this.click(hand)
      },
      throttle,
      { trailing: false }
    )
  },

  /**
   * Detect click state and trigger a real click event
   */
  onFrame({ hand }) {
    if (!hand || !hand.annotations) return

    // Detect if the threshold for clicking is met with specific morphs
    const a = hand.annotations.indexFinger[3][0] - hand.annotations.thumb[3][0]
    const b = hand.annotations.indexFinger[3][1] - hand.annotations.thumb[3][1]
    const c = Math.sqrt(a*a + b*b)
    this.thresholdMet = c < this.config.pinchDistance

    // Count errors
    if (this.thresholdMet) {
      this.numErrorFrames = 0
    } else {
      ++this.numErrorFrames
    }

    // Mouse drag
    if (this.mouseDowned && this.numErrorFrames < this.config.numErrorFrames) {
      hand.pointer.state = 'mousemove'
    }

    // Check if clicked down
    if (this.thresholdMet && !this.mouseDowned) {
      this.mouseDowned = true
      this.mouseUpped = false
      document.body.classList.add('handsfree-clicked')
      hand.pointer.state = 'mousedown'
    }

    // Release
    if (!this.thresholdMet && !this.mouseUpped && this.numErrorFrames < this.config.numErrorFrames) {
      this.mouseDowned = false
      this.mouseUpped = true
      document.body.classList.remove('handsfree-clicked')
      hand.pointer.state = 'mouseup'
    }

    window.renderer && hand.pointer.state && this.click(hand)
  },

  /**
   * The actual click method, this is what gets throttled
   */
  click(hand) {
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
  },

  /**
   * Throttles the click event
   * - Defined in onuse
   */
  maybeClick: function() {}
})