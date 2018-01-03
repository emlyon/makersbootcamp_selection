function getFormData() {
    var elements = document.getElementById("gform").elements; // all form elements
    var fields = Object.keys(elements).map(function(k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k) {
        data[k] = elements[k].value;
        var str = ""; // declare empty string outside of loop to allow
        // it to be appended to for each item in the loop
        if (elements[k].type === "checkbox") { // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append
            // the current checked value to
            // the end of it, along with
            // a comma and a space
            data[k] = str.slice(0, -2); // remove the last comma and space
            // from the  string to make the output
            // prettier in the spreadsheet
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });
    console.log(data);
    return data;
}

function handleFormSubmit(event) { // handles form submit withtout any jquery
    event.preventDefault(); // we are submitting via xhr below
    var data = getFormData(); // get the values submitted in the form
    document.querySelectorAll('fieldset>span')
        .forEach(function(span) {
            span.style.display = 'none';
        });
    if (document.getElementById('firstname').value === "") {
        document.getElementById('firstname-field').style.display = 'block';
        return false;
    }
    else if (document.getElementById('lastname').value === "") {
        document.getElementById('lastname-field').style.display = 'block';
        return false;
    }
    else if (document.getElementById('email').value === "") {
        document.getElementById('email-field').style.display = 'block';
        return false;
    }
    else if (document.getElementById('print').value.indexOf("thingiverse.com/") == -1) {
        document.getElementById('print-invalid').style.display = 'block';
        return false;
    } else if (document.getElementById('web').value.indexOf("codepen.io/") == -1) {
        document.getElementById('web-invalid').style.display = 'block';
        return false;
    } else if (document.getElementById('laser').value.indexOf("thingiverse.com/") == -1) {
        document.getElementById('laser-invalid').style.display = 'block';
        return false;
    } else if (document.getElementById('arduino').value.indexOf("tinkercad.com/") == -1) {
        document.getElementById('arduino-invalid').style.display = 'block';
        return false;
    } else {
        var url = event.target.action; //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            console.log(xhr.status, xhr.statusText);
            console.log(xhr.responseText);
            document.getElementById('gform').style.display = 'none'; // hide form
            document.getElementById('submit_message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        console.log( encoded );
        xhr.send(encoded);
    }
}

function loaded() {
    var form = document.getElementById('gform');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
