let isAnimating = false

function getButtonPosition(isOpen) {
  const bar = document.querySelector('.lgpd-bar')
  const acceptButton = document.querySelector('.lgpd-accept')
  let leftDistance = null

  if (!isOpen) {
    const left = bar.scrollWidth / 2 - acceptButton.scrollWidth / 2

    leftDistance = left
  }

  return leftDistance
}

function getMobileHeight(isOpen) {
  const header = document.querySelector('.lgpd-header')
  const content = document.querySelector('.lgpd-content')
  const acceptButton = document.querySelector('.lgpd-accept')

  const em = (+getComputedStyle(header).getPropertyValue('font-size').split('px')[0])
  let distance = header.scrollHeight

  if (!isOpen) {
    distance = header.scrollHeight + content.scrollHeight + em + acceptButton.scrollHeight
  }

  return distance
}

function calculateMobileDistances(isOpen) {
  return {
    left: getButtonPosition(isOpen),
    height: getMobileHeight(isOpen)
  }
}

function setMobileDistances(open) {
  const bar = document.querySelector('.lgpd-bar')
  const acceptButton = document.querySelector('.lgpd-accept')
  let left

  if (calculateMobileDistances(!open).left === null) {
    left = 'unset'
  } else {
    left = `${calculateMobileDistances(!open).left}px`;
  }

  bar.style.height = `${calculateMobileDistances(!open).height}px`
  acceptButton.style.left = left
}

function resetDesktopBar() {
  const bar = document.querySelector('.lgpd-bar')
  const acceptButton = document.querySelector('.lgpd-accept')

  bar.removeAttribute('style')
  acceptButton.removeAttribute('style')
  bar.classList.remove('lgpd-animating')
  bar.classList.remove('lgpd-done')
  disableOverflow(false)
  disableTabIndex(false)
}

function disableOverflow(status) {
  const body = document.querySelector('body')

  if (status) {
    body.style.overflow = 'hidden'
  } else {
    body.style.overflow = 'visible'
  }
}

function disableTabIndex(status) {
  const content = document.querySelectorAll('.lgpd-content a, .lgpd-content button')

  if (status) {
    content.forEach(function (e) {
      e.setAttribute('tabindex', '-1')
    })
  } else {
    content.forEach(function (e) {
      e.setAttribute('tabindex', '0')
    })
  }
}

function hideFilter(status) {
  const filter = document.querySelector('.lgpd-filter')

  if (status) {
    filter.style.display = 'none'
  } else {
    filter.style.display = 'block'
  }
}

function closeByFilter(event) {
  if (event.target.classList.contains('lgpd-filter')) toggleLGPD('close')
}

function toggleLGPD(behavior) {
  const container = document.querySelector('.lgpd-container')

  if (window.matchMedia("(max-width: 767px)").matches) {
    if (isAnimating) return

    isAnimating = true

    if (!container.classList.contains('lgpd-done')) {
      openLGPD()
    } else {
      closeLGPD()
    }

    if (behavior === 'open') openLGPD()
    if (behavior === 'close') closeLGPD()

  } else {
    resetDesktopBar()
  }

  function openLGPD() {
    container.classList.add('lgpd-animating')
    disableOverflow(true)
    setMobileDistances(true)
    disableTabIndex(false)
    hideFilter(false)

    setTimeout(() => {
      container.classList.add('lgpd-done')
      isAnimating = false
    }, 300)
  }

  function closeLGPD() {
    container.classList.remove('lgpd-done')
    container.classList.remove('lgpd-animating')

    setTimeout(() => {
      setMobileDistances(false)
      disableOverflow(false)
      disableTabIndex(true)
      hideFilter(true)
      isAnimating = false
    }, 150)
  }
}

function saveOnDatabase() {
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log('Saved on database')
    } else {
      console.error('Database error')
      return
    }
  };

  xhttp.open("POST", "file.php", true);
  xhttp.send();
}

function destroyLGPD() {
  const container = document.querySelector('.lgpd-container')

  saveOnDatabase()
  container.classList.add('lgpd-destroy')

  setTimeout(() => {
    disableOverflow(false)
    container.remove()
  }, 150)
}

window.addEventListener('resize', function () {
  const isContainerVisible = document.querySelector('.lgpd-container').classList.contains('lgpd-done')

  if (window.matchMedia("(max-width: 767px)").matches) {
    setMobileDistances(isContainerVisible)
  } else {
    resetDesktopBar()
  }
})

window.addEventListener('click', function (e) {
  closeByFilter(e)
})
