$(document).ready(function() {
  $('.add-comment').on('click', (event) => {
    event.preventDefault();
    axios.get('/comment').then((res) => {
      console.log(res.data);
      let myUsername = res.data.username;
      let myId = res.data.id;
      let myText = $(`#comment-text-${event.currentTarget.id.replace(/^\D+/g, '')}`).val();
      let currentTime = moment().fromNow();
      let obj = {
        text: myText,
        UserId: res.data.id,
        username: myUsername,
        PostId: $(`#PostId-${event.currentTarget.id.replace(/^\D+/g, '')}`).val()
      };
      console.log(obj);
      $.post("/comment", obj).then((result) => {
        let html =
          `
        <div class="media">
          <div class="d-flex mr-3">
            <img class="comment-avatar rounded-circle" src='/api/img/${myId}' alt="user-avatar">
          </div>
          <div class="media-body">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">${myUsername}</h5>
              <small>${currentTime}</small>
            </div>
              <p class="mb-1">${myText}</p>
          </div>
        </li>
        `;
        $(`#all-comments-${event.currentTarget.id.replace(/^\D+/g, '')}`).append(html);
        console.log(result);
      });
    });
  });
});