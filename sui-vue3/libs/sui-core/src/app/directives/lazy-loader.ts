export default {
  // see: https://v3-migration.vuejs.org/breaking-changes/custom-directives.html#_3-x-syntax
  mounted: (el: Element) => {

    const loadImage = () => {
      const imageElement = Array.from(el.children).find(
        element => element.nodeName === 'IMG',
      )
      if (imageElement) {
        const type = el.getAttribute('type')

        imageElement.addEventListener('load', () => {
          setTimeout(() => el.classList.add('sm-lazy-image--loaded'), 100)
          setTimeout(() => el.querySelector('.sm-lazy-image--loading')?.remove(), 600)
        })

        ;(imageElement as HTMLImageElement).src = (imageElement as HTMLImageElement).dataset.url!

        if (type === 'background') {
          const element = el as HTMLImageElement
          element.style.backgroundImage = `url('${(imageElement as HTMLImageElement).dataset.url!}')`
          ;(imageElement as HTMLImageElement).remove()
        }

        imageElement.addEventListener('error', () => {
          setTimeout(() => el.classList.add('sm-lazy-image--loaded-error'), 100)
          setTimeout(() => el.querySelector('.sm-lazy-image--loading')?.remove(), 600)
        })
      }
    }

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    const createObserver = () => {
      const options = {
        root: null,
        threshold: Number(el.getAttribute('threshold')) || 0.01,
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }

    if (window.IntersectionObserver) {
      createObserver()
    } else {
      loadImage()
    }
  },
}
