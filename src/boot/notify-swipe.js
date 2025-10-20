import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

export default boot(() => {
  const originalNotify = Notify.create

  Notify.create = function (options) {
    const notification = originalNotify(options)

    requestAnimationFrame(() => {
      const notifEls = document.querySelectorAll('.q-notification')
      const el = notifEls[notifEls.length - 1]
      if (!el) return

      let startX = 0
      let currentX = 0
      let translateX = 0
      let isDragging = false

      const threshold = 100 // Distanz in px zum Dismiss
      const maxOffset = 500 // Wie weit das Element beim Dismiss fliegt

      const resetStyle = () => {
        el.style.transition = 'all 0.2s ease'
        el.style.transform = 'translateX(0)'
        el.style.opacity = '1'
      }

      const dismiss = (direction) => {
        el.style.transition = 'all 0.2s ease'
        el.style.transform = `translateX(${direction > 0 ? maxOffset : -maxOffset}px)`
        el.style.opacity = '0'
        setTimeout(() => notification(), 150)
      }

      const handleMoveCommon = (deltaX) => {
        if (!isDragging) return
        translateX = deltaX
        el.style.transform = `translateX(${translateX}px)`
        el.style.opacity = `${1 - Math.min(Math.abs(translateX) / 150, 0.8)}`
      }

      const handleEndCommon = () => {
        if (!isDragging) return
        isDragging = false
        if (Math.abs(translateX) > threshold) {
          dismiss(translateX)
        } else {
          resetStyle()
        }
      }

      // --- Touch Events (Mobile)
      el.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX
        isDragging = true
        el.style.transition = 'none'
      }, { passive: true })

      el.addEventListener('touchmove', (e) => {
        handleMoveCommon(e.touches[0].clientX - startX)
      }, { passive: true })

      el.addEventListener('touchend', handleEndCommon, { passive: true })

      // --- Mouse Events (Desktop)
      el.addEventListener('mousedown', (e) => {
        startX = e.clientX
        isDragging = true
        el.style.transition = 'none'
        document.body.style.userSelect = 'none' // verhindert Textauswahl
      })

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return
        handleMoveCommon(e.clientX - startX)
      })

      window.addEventListener('mouseup', () => {
        if (!isDragging) return
        document.body.style.userSelect = ''
        handleEndCommon()
      })
    })

    return notification
  }
})

