import $ from "jquery";
import CTFd from "core/CTFd";
import { ezQuery } from "core/ezq";

export function showHintModal(event) {
  event.preventDefault();
  $("#hint-edit-modal form")
    .find("input, textarea")
    .val("");

  // Markdown Preview
  $("#new-hint-edit").on("shown.bs.tab", function(event) {
    if (event.target.hash == "#hint-preview") {
      const renderer = CTFd.lib.markdown();
      const editor_value = $("#hint-write textarea").val();
      $(event.target.hash).html(renderer.render(editor_value));
    }
  });

  $("#hint-edit-modal").modal();
}

export function showEditHintModal(event) {
  event.preventDefault();
  const hint_id = $(this).attr("hint-id");

  CTFd.fetch("/api/v1/hints/" + hint_id + "?preview=true", {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if (response.success) {
        $("#hint-edit-form input[name=content],textarea[name=content]").val(
          response.data.content
        );
        $("#hint-edit-form input[name=cost]").val(response.data.cost);
        $("#hint-edit-form input[name=id]").val(response.data.id);

        // Markdown Preview
        $("#new-hint-edit").on("shown.bs.tab", function(event) {
          if (event.target.hash == "#hint-preview") {
            const renderer = CTFd.lib.markdown();
            const editor_value = $("#hint-write textarea").val();
            $(event.target.hash).html(renderer.render(editor_value));
          }
        });

        $("#hint-edit-modal").modal();
      }
    });
}

export function deleteHint(event) {
  event.preventDefault();
  const hint_id = $(this).attr("hint-id");
  const row = $(this)
    .parent()
    .parent();
  ezQuery({
    title: "Delete Hint",
    body: "Are you sure you want to delete this hint?",
    success: function() {
      CTFd.fetch("/api/v1/hints/" + hint_id, {
        method: "DELETE"
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.success) {
            row.remove();
          }
        });
    }
  });
}

export function editHint(event) {
  event.preventDefault();
  const params = $(this).serializeJSON(true);
  params["challenge"] = window.CHALLENGE_ID;

  let method = "POST";
  let url = "/api/v1/hints";
  if (params.id) {
    method = "PATCH";
    url = "/api/v1/hints/" + params.id;
  }
  CTFd.fetch(url, {
    method: method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        // TODO: Refresh hints on submit.
        window.location.reload();
      }
    });
}
