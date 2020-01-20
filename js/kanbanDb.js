/*
    jQ for kanban
    
    Name:           kanban.js
    Author:         Jack Ramsey
    Created:        2020-01-19
    Last Revised:   2020-01-20
    Purpose:        Functionality for kanban board, including
                    - drag and drop functionality
                    - open/close modal
                    - take user input and create new card
                    - append new jobs to table
                    - delete jobs on user demand
                    
    Trying to give the kanban a DB backend, instead of a flat-file, which
    has proven to be pretty fragile
*/

$(document).ready(function () {
    $.ajaxSetup({
        cache: false
    });

    
    // variables 
    var cards = $('.card-outer'); // get all cards
    var cells = $('td'); // get all table cells
    var closers = $('.close'); // close spans
    var closeModal = $('.close-modal'); // close-modal span
    var modalAdd = $('#modalAdd'); // modal add record
    var modalEdit = $('#modalEdit'); // modal edit record
    var add = $('#add'); // add job button
    var save = $('#save'); // save sheet button
    var submitNew = $('#submitNew'); // submit button
    var submitEdit = $('#submitEdit'); // submit button
    var currentPosition; // for window scrolling
    
    // global variables for card creation and modification
    var job, owner, desc, assign, due, priority, status, data;
    var newJob, newOwner, newDesc, newAssign, newDue, newPriority, newStatus;
    
    getTable();
    
    // query database & get all current cards
    function getTable() {
        var ajax = new XMLHttpRequest();
        var method = "GET";
        var url = "php/get-data.php";
        var sync = true;

        ajax.open(method, url, sync);
        ajax.send();

        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                for (var i = 0; i < data.length; i++) {
                    var string = 
                        "<tr><td>" + data[i].title + "</td>" +
                            "<td>" + data[i].owner + "</td>" +
                            "<td>" + data[i].description + "</td>" +
                            "<td>" + data[i].assigned + "</td>" +
                            "<td>" + data[i].due + "</td>" +
                            "<td>" + data[i].priority + "</td>" +
                            "<td></td><td></td>" +
                        "</tr>";
                    addNewRow(buildNewCard(data[i].title, data[i].owner, data[i].description, data[i].assigned, data[i].due, data[i].priority, data[i].id, data[i].status));
                    cells = $("td");
                }
            }
        }
    }
  
    var tableData;  // probably don't need this anymore since implementing the DB
    ////////////////////////////////////////////////////////////////

    // make the rows sortable (drag & drop)
    $('#tab tbody').sortable({
        axis: 'y',
        snap: 'tr',
        opacity: .7,
        cursor: 'ns-resize',
        stop: function (event, ui) {
            $('tr').removeClass();
            $('tr').removeAttr('style');
            tableData = $('#tab').html();
        }
    });

    // close modal 
    closeModal.click(function () {
        modalAdd.fadeOut(500);
        modalEdit.fadeOut(500);
    });

    // open modal
    add.click(function () {
        modalAdd.fadeIn(500);

        if ($('radio1').attr('checked', false)) {
            $('radio1').attr('checked', true);
        }
    });

    // event listener for saveTable()
    // once the DB is fully functional,
    // won't need this anymore
    save.click(function () {
        //        saveTable();
        $('#saveMsg').slideDown(500).delay(1000).slideUp(300);
    });

    //  New cards
    ///////////////////////////////////////////////////////////////////////////
    // submit new record
    submitNew.click(function () {
        // get field values from the modal
        job = $('#job').val();
        owner = $('#owner').val();
        desc = $('#desc').val();
        assign = $('#assigned').val();
        due = $('#due').val();
        priority = $("input[name='priority']:checked").val();
        status = 0;

        if (!assign) {
            assign = getDate();
        }
        if (!due) {
            due = assign;
        }
        if (!priority) {
            priority = 'LOW';
        }

        // validate the form input
        var valid = validateForm(job, owner, desc);

        if (valid) {
            modalAdd.fadeOut(500);

            addNewRow(buildNewCard(job, owner, desc, assign, due, priority));
            
            $.ajax({
                type: 'POST',
                url: 'php/add-card.php',
                data: { 'title': job, 'owner': owner, 'description': desc, 'assigned': assign, 'due': due, 'priority': priority },
                success: function(response) {
                    //getTable();
                }
            });
            
            // reset form fields for next add
            $('#job').val('')
            $('#owner').val('');
            $('#desc').val('');
            $('#assigned').val('');
            $('#due').val('');
            $('#radio1').attr('checked', true);
        }

    });

    // get today's date, if no assign date provided
    function getDate() {
        var date = new Date();
        //        var today = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
        var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        return today;
    }

    // add a new row for a new job
    function addNewRow(n) {     // 'n' is the return value from buildNewCard()

        var markup = "<tr><td>" + n + "</td><td></td><td></td></tr>";
        $('#tab > tbody > tr').eq(0).after(markup);

        // re-register drag, drop, and close events
        // for new row
        cards = $('.card-outer');
        cards.draggable({
            snap: 'td',
            cursor: 'move'
        });

        cells = $('td');
        cells.droppable();

        closers = $('.close');
        closers.click(function () {
            var id = $(this).attr("id");
        
        // remove the card from the database
            $.ajax({
                type: 'POST',
                url: 'php/remove-card.php',
                data: { 'id': id },
                success: function(response) {
                }
            });
            
        // remove the row from the table
            $(this).parents("tr").remove();
        });
        ///////////////////////////////////////////
    }

    // create new row with input values
    function buildNewCard(j, o, d, a, due, p, id, status) {
        var s = '';

        switch (p) {
            case 'LOW':
                s = 'style="background:#009900"';
                break;
            case 'MED':
                s = 'style="background:#0000ff"';
                break;
            case 'HI':
                s = 'style="background:#ff0000"';
                break;
        }

        var out = "<div class='card-outer' id='card" + id + "'>" +
            "<div class='card-inner'>" +
            "<span class='close' id='" + id + "'><i class='fa fa-close'></i></span>" +
            "<header " + s + ">" + j + "</header>" +
            "<div class='card-content'>" + d + "</div>" +
            "<div class='dates'>" +
            "<label> Assigned: </label> " + "<span>" + a + "</span>" +
            "<label> Due: </label> " + "<span>" + due + "</span>" +
            " </div>" +
            "<div id='footer' class='footer'>" +
            "Owner: <span>" + o + "</span" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<span style='display:none;'>" + id + ";" + j + ";" + d + ";" + o + ";" + a + ";" + due + ";" + s + ";" + status + "</span>";
        return out;
    }

    function validateForm(job, owner, desc) {
        var a = new Date(assign);
        var d = new Date(due);

        if (!job || !owner || !desc || !assign) {
            alert('Please complete all fields!\n(Due date optional)');
            return false;
        } else if (d.getTime() < a.getTime()) {
            alert('Due date cannot come before assignment date!');
            return false
        } else {
            return true;
        }
    }
    ///////////////////////////////////////////////////////////////////////////

    // Edit a card    
    ///////////////////////////////////////////////////////////////////////////

    var cell, cellHtml, currentPosition; //needed these global for updating cards
    
    
    // edit card    
    function editJob(id) {
        cell = $(id);

        currentPosition = cell.offset();
        window.scrollTo(0, 0);

        modalEdit.fadeIn();

        cellHtml = cell.html();
        var temp = cell.text();
        var tempParsed = temp.split(';');
        job = tempParsed[1].trim();
        desc = tempParsed[2].trim();
        owner = tempParsed[3].trim();
        assign = tempParsed[4].trim();
        due = tempParsed[5].trim();
        priority = tempParsed[6].trim();
        status = tempParsed[7];

        $('#jobEdit').val(job);
        $('#descEdit').val(desc);
        $('#ownerEdit').val(owner);
        $('#assignedEdit').val(assign);
        $('#dueEdit').val(due);

        switch (priority) {
            case 'style="background:#009900"':
                $('#radio1Edit').attr('checked', true);
                break;
            case 'style="background:#0000ff"':
                $('#radio2Edit').attr('checked', true);
                break;
            case 'style="background:#ff0000"':
                $('#radio3Edit').attr('checked', true);
                break;
        }

    };

    // submit edited info 
    submitEdit.click(function () {
        newJob = $('#jobEdit').val();
        newDesc = $('#descEdit').val();
        newOwner = $('#ownerEdit').val();
        newAssign = $('#assignedEdit').val();
        newDue = $('#dueEdit').val();
        newPriority = $("input[name='priority']:checked").val();
        var newHtml = cellHtml;

        switch (newPriority) {
            case 'low':
                newPriority = 'style="background:#009900"';
                break;
            case 'med':
                newPriority = 'style="background:#0000ff"';
                break;
            case 'high':
                newPriority = 'style="background:#ff0000"';
                break;
        }
        

        // update the card's data fields
        newHtml = newHtml.replace(job, newJob);
        newHtml = newHtml.replace(";" + job, ";" + newJob);
        newHtml = newHtml.replace(desc, newDesc);
        newHtml = newHtml.replace(";" + desc, ";" + newDesc);
        newHtml = newHtml.replace(owner, newOwner);
        newHtml = newHtml.replace(";" + owner, ";" + newOwner);
        newHtml = newHtml.replace(assign, newAssign);
        newHtml = newHtml.replace(";" + assign, ";" + newAssign);
        newHtml = newHtml.replace(due, newDue);
        newHtml = newHtml.replace(";" + due, ";" + newDue);
        newHtml = newHtml.replace(priority, newPriority);
        newHtml = newHtml.replace(";" + priority, ";" + newPriority);

        var valid = validateForm(job, owner, desc, assign, due, priority);

        if (valid) {
            modalAdd.fadeOut(500);
            cell.html(newHtml);

           
            console.log(currentPosition);
            window.scrollTo(currentPosition.left, (currentPosition.top - 150));

            // reset form fields for next edit
            $('#job').val('')
            $('#owner').val('');
            $('#desc').val('');
            $('#assigned').val('');
            $('#due').val('');
            $('#radio1').attr('checked', true);
        }

        modalEdit.fadeOut(500);
    });

    document.getElementById('tab').addEventListener('dblclick', function(e) {
        e.preventDefault();
        var path = e.path;
        
        var index = path.findIndex(x => x.className === "card-outer ui-draggable ui-draggable-handle");
        
        var outer = path[index];
        var id = "#" + outer.id;

        editJob(id);
    });
    
    // collapse card    
    document.getElementById('tab').addEventListener("contextmenu", function (e) {
        e.preventDefault();

        // when the event fires, it returns an object named 'e'
        var path = e.path; // get the path array from the event object
        
        // find the index of the 'card-outer' object in the array. this is necessary
        // because it will vary depending on where on the card the user clicks
        var index = path.findIndex(x => x.className === "card-outer ui-draggable ui-draggable-handle");
        
        // put the 'card-outer' element into a variable
        var outer = path[index];

        // get the element's height. it'll either be 202 (I don't know where the extra
        // two pixels came from, but I'm running with it) or 30
        
        var height = outer.offsetHeight;

        // toggle card-outer's height
        if (height == 202) {
            outer.style.height = '30px';
        } else {
            outer.style.height = '202px';
        }

        //        saveTable();
    });

    /*
    var whenReady = (function () { // This function returns the whenReady() function
        var funcs = []; // The functions to run when we get an event
        var ready = false; // Switches to true when the handler is triggered

        // The event handler invoked when the document becomes ready
        function handler(e) {
            // If we've already run once, just return
            if (ready) return;

            // If this was a readystatechange event where the state changed to
            // something other than "complete", then we're not ready yet
            if (e.type === "readystatechange" && document.readyState !== "complete")
                return;

            // Run all registered functions.
            // Note that we look up funcs.length each time, in case calling
            // one of these functions causes more functions to be registered.
            for (var i = 0; i < funcs.length; i++)
                funcs[i].call(document);

            // Now set the ready flag to true and forget the functions
            ready = true;
            funcs = null;
            
            getTable();
        }

        // Register the handler for any event we might receive
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", handler, false);
            document.addEventListener("readystatechange", handler, false);
            window.addEventListener("load", handler, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", handler);
            window.attachEvent("onload", handler);
        }

        // Return the whenReady function
        return function whenReady(f) {
            if (ready) f.call(document); // If already ready, just run it
            else funcs.push(f); // Otherwise, queue it for later.
        }
        
    }());
    */
});
