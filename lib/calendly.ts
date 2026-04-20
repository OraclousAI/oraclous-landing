const CSS_URL = 'https://assets.calendly.com/assets/external/widget.css'
export const CALENDLY_URL = 'https://calendly.com/reza-oraclous/consultancy-with-reza-oraclous'

let cssInjected = false

export function openCalendly(url = CALENDLY_URL) {
  if (!cssInjected) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = CSS_URL
    document.head.appendChild(link)
    cssInjected = true
  }
  ;(window as any).Calendly?.initPopupWidget({ url })
}
