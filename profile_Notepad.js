// {id:{title,content}}
var mynotes = new Object;
// edit button change active class to #createnote to add note content to form
function toggleActive(ele) {
    $("button.note_tab.active").removeClass("active");
    $(ele).toggleClass("active");
    //  change active class of tab page on click of nav button
    if ($(ele).hasClass("active")) {
        const id = $(ele).attr("note");
        $("div.tab_content.active").removeClass("active");
        if (id == "+") {
            $("div.tab_content#create_note").addClass("active");
        }
        else {
            $(`div.tab_content#${id}`).addClass("active");
        }
    }
}
function editNote(ele) {
    const id = $(ele).attr("note");
    const title = $(`.tab_content#${id} .note_title`).text();
    const content = $(`.tab_content#${id} .note_content`).text();
    $(`.tab_content#${id}`).removeClass("active");
    // change active class to create note tab button and page
    $("div#create_note").addClass("active");
    $("input#note_title").val(title);
    $("textarea#note_content").val(content);
}
function deleteNote(ele) {
    const id = $(ele).attr("note")
    delete mynotes[id]
    $(`.tab_content#${id}`).remove()
    $(`.note_tab[note="${id}"]`).remove()
}
$(function() {
    function loadNotes() {
        // load note from localStorage if >1 note preexisting else store current notes on localStorage
        if ($("button.note_tab").length == 1) {
            let notes = localStorage["mynotes"];
            notes = JSON.parse(notes);
            for (let note in Object.keys(notes)) {
                let {title,content} = notes[note];
                newNote(title,content,id);
              }
        }
        else {
            let notes = $("div.tab_content");
            for (let note of notes) {
                const id = $(note).attr("id");
                const title = $(note).find(".note_title").text();
                const content = $(note).find(".note_content").text();
                if (id == "create_note") {
                    continue
                }
                else {
                    mynotes[id] = {title,content};
                }
            }
        }
    }
    function storeNotes() {
        localStorage["mynotes"] = JSON.stringify(mynotes);
    }
    // toggle expanded class to extend home menu botton
    $("button.toggle_menu").click(() => {
        $("button.toggle_menu").toggleClass("expanded");
        $("div.homemenu").toggleClass("expanded");
    });
    // toggle slideIn and out of note
    $(".notepad_icon").click(() => {
        $("div.mynotes").addClass("slideIn");
        loadNotes();
    })
    // slideOut and store notes on closing of notes
    $("button.close_note").click(() => {
        $("div.mynotes").removeClass("slideIn");
        storeNotes();
    })
    // change note content
    function updateNote(ele,title,content,oldid,id) {
        // replace text of old element, note attr of buttons
        $(`div.tab_content#${oldid}`).find(".note_title").text(title);
        $(`div.tab_content#${oldid}`).find(".note_content").text(content);
        $(`div.tab_content#${oldid}`).find(".deleteNote_button").attr("note",id);
        $(`div.tab_content#${oldid}`).find(".edit_button").attr("note",id);
        $(`div.tab_content#${oldid}`).attr("id",id);
        $(ele).text(title);
        $(ele).attr("note",id);
        // empty create note texts
        $("div#create_form").find("input,textarea").val("");
        $("div.tab_content#create_form").removeClass("active");
        $(`div.tab_content#${id}`).addClass("active");
        // delete and add new note
        delete mynotes[oldid];
        mynotes[id] = {title,content};
    }
    // create new note
    function newNote(title,content,id) {
        let button = `<button class='note_tab' note="${id}" onclick="toggleActive(this)"><h3>${title}</h3></button>`;
        let t = `<div class="topNote">
        <h2 class="note_title">${title}</h2>
        <img src="images/delete_black.svg" alt="delete_note_icon" class="deleteNote_button" note="${id}" onclick="deleteNote(this)">
        <img src="images/edit_white.svg" alt="edit_icon" class="edit_button" note="${id}" onclick="editNote(this)"></div>`;
        let c = `<p class="note_content">${content}</p>`;
        let newtab = `<div id=${id} class="tab_content">${t}${c}</div>`;
        $("button.create_note").after(button);
        $("div#create_note").after(newtab);
        mynotes[id] = {title,content};
    }
    // create new note or update note
    $("button.submit").click(() => {
        let title = $("input[type='text']").val();
        const id = title.replace(/\W/g,"").replace(/\s/g,"");
        let content = $("textarea#note_content").val();
        if ($("button.active").hasClass("create_note")) {
            newNote(title,content,id);
        } 
        else {
            let editingele = $("button.note_tab.active");
            let oldid = editingele.attr("note").replace(/\W/g,"").replace(/\s/g,"");
            updateNote(editingele,title,content,oldid,id);
        }
    })
})