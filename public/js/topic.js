/* global alert, $, location */
$('#buttonSave').click(function () {
  let data = {
    name: $('#newTopicName').val()
  }
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(data.name)) {
    alert('Invalid Name')
  } else {
    $.ajax({
      type: 'POST',
      url: '/topic',
      data: data,
      error: function (error) {
        alert(error)
      },
      success: function (data) {
        location.reload()
      }
    })
  }
})
function deleteAction(name) {
  let data = {
    name: name
  }
  $.ajax({
    type: 'DELETE',
    url: '/topic',
    data: data,
    error: function (error) {
      alert(error)
    },
    success: function (data) {
      alert(data)
      location.reload()
    }
  })
}
