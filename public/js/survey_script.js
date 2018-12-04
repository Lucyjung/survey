/* global alert, $ */
var survey = {} // Bidimensional array: [ [1,3], [2,4] ]
var topic = ''
var gender = ''
var com1 = ''
var com2 = ''

$('#btn-edit').click(function () {
  $('#mtopic').hide()
  $('#btn-edit').hide()
  $('#etopic').show()
  $('#btn-save').show()
})

$('#btn-save').click(function () {
  topic = $('#etopic').val()
  $('#etopic').hide()
  $('#btn-save').hide()
  $('#mtopic').text(topic)
  $('#ptopic').text(topic)
  $('#mtopic').show()
  $('#btn-edit').show()
})

$(document).ready(function () {
  $(':radio').click(function () {
    gender = $(this).val()
  })

  // Switcher function:
  $('.rb-tab').click(function () {
    // Spot switcher:
    $(this).parent().find('.rb-tab').removeClass('rb-tab-active')
    $(this).addClass('rb-tab-active')
  })

  // Save data:
  $('.trigger').click(function () {
    com1 = $('#comment').val()
    com2 = $('#comment2').val()
    if (topic === '0') {
      alert('Plese select your topic')
    }
    if (gender === '') {
      alert('Plese select your genders')
    } else {
      // Empty array:
      survey = {}
      // Push data:
      for (let i = 1; i <= $('.rb').length; i++) {
        var rb = '#rb-' + i
        var rbValue = parseInt($(rb).find('.rb-tab-active').attr('data-value'))
        survey[i] = rbValue
      };

      getUserIP(function (ip) {
        let data = {
          name: $('#ptopic').html(),
          participant: ip,
          score: {
            comment1: com1,
            comment2: com2,
            gender: gender,
            survey: survey
          }
        }
        $.ajax({
          type: 'PUT',
          url: '/score',
          data: data,
          error: function (error) {
            alert(error)
          },
          success: function (data) {
            alert(data)
          }
        })
      })
    }
  })
})

function getUserIP (onNewIP) { //  onNewIp - your listener function for new IPs
  // compatibility for firefox and chrome
  var MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  var pc = new MyPeerConnection({
    iceServers: []
  })
  var noop = function () {}
  var localIPs = {}
  var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

  function iterateIP (ip) {
    if (!localIPs[ip]) onNewIP(ip)
    localIPs[ip] = true
  }

  // create a bogus data channel
  pc.createDataChannel('')

  // create offer and set local description
  pc.createOffer().then(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return
      line.match(ipRegex).forEach(iterateIP)
    })

    pc.setLocalDescription(sdp, noop, noop)
  }).catch(function (reason) {
    // An error occurred, so handle the failure to connect
  })

  // listen for candidate events
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}
