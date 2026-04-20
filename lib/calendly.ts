const CSS_URL = 'https://assets.calendly.com/assets/external/widget.css'
const JS_URL  = 'https://assets.calendly.com/assets/external/widget.js'
export const CALENDLY_URL = 'https://calendly.com/reza-oraclous/consultancy-with-reza-oraclous'

let cssInjected  = false
let scriptLoading = false
let scriptReady   = false

export function openCalendly(url = CALENDLY_URL) {
  if (!cssInjected) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = CSS_URL
    document.head.appendChild(link)
    cssInjected = true
  }

  if (scriptReady) {
    ;(window as any).Calendly.initPopupWidget({ url })
    return
  }

  if (!scriptLoading) {
    scriptLoading = true
    const script = document.createElement('script')
    script.src = JS_URL
    script.onload = () => {
      scriptReady = true
      ;(window as any).Calendly.initPopupWidget({ url })
    }
    document.body.appendChild(script)
  }
}
