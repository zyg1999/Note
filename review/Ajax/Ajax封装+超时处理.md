```js
function Ajax(options) {
  options = options || {}
  options.type = (options.type || 'GET').toUpperCase()
  options.async = options.async || true
  options.timeout = options.timeout || 8000

  const xhr = getXhr()
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      const s = xhr.status
      if ((s >= 200 && s < 300) || s == 304) {
        console.log(xhr.responseText)
      }
    }
  }
  xhr.timeout = options.timeout
  xhr.ontimeout = function(e) {
    console.log('timeout')
    xhr.abort()
  }
  if (options.type === 'GET') {
    xhr.open(
      'GET',
      options.url + '?' + getParams(options.data),
      options.async
    )
    xhr.send()
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, options.async)
    xhr.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    )
    xhr.send(options.data)
  }
}

function getXhr() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest()
  } else {
    return new ActiveXObject('Microsoft.XMLHTTP')
  }
}
function getParams(data) {
  let arr = []
  for (let i in data) {
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
  }
  return arr.join('&')
}
Ajax({
  url: 'http://localhost:8888/test',
  type: 'get',
  data: {
    a: 1,
    b: 2
  },
  async: true,
  timeout: 1000
})
```