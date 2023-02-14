var popUpOk = "Ok !";
var popUpYes = "Yes";
var popUpNo = "No";
var popUpAccept = "Accept"
var popUpCancel = "Cancel";

var popUpInput = null;
function Pop (message, button, title, onconfirm)
{
    if (message == null || message.toString().trim() == "") message = "ping !";
    if (button == null) button = false;
    if (title == null) title = "";
    if (onconfirm == null) onconfirm = Emptyness;
    if (button == false && onconfirm != Emptyness)
    {
        onconfirm = Emptyness;
        console.error("Events can only be fired when button is clicked, but no button has been created ! "+
                      "To create that button, set second argument on true.");
    }
    newWindow = new PopUpWindow(message, title, "PRINT", button, onconfirm, Emptyness);
    newWindow.Show();
}
function Request (onaccept, message, ondenied, open, title)
{
    if (onaccept == null)
    {
        console.error("Could not bind user input to anything !");
    }
    else
    {
        if (message == null)  message = "Accepts ?";
        if (ondenied == null) ondenied = Emptyness;
        if (open == null) open = false;
        if (title == null) title = "";
        const newWindow = new PopUpWindow(message, title, "INPUT", open, onaccept, ondenied);
        newWindow.Show();
    }
}
function Emptyness ()
{
    let emptyness = null;
}

class PopUpWindow
{
    constructor (text, head, type, advanced, feedback, ondenied)
    {
        this.Content = text;
        this.Tag = type;
        this.Advanced = advanced;
        this.Text = head;
        this.Accept = feedback;
        this.Denied = ondenied;
        this.InstanceID = Math.random().toString().substring(2);
    }

    Show ()
    {
        const form = document.createElement("div");
        form.style.backgroundColor = "aliceblue";
        form.style.position = "fixed";
        form.style.zIndex = 9999;
        form.style.left = window.innerWidth / 2 + "px";
        form.style.transform = "translate(-50%, -100%)";
        form.style.transition = "transform 0.5s ease, opacity 6s";
        window.addEventListener("resize", () =>
        {
            form.style.left = window.innerWidth / 2 + "px";
            form.style.transform = "translate(-50%, 10%)";
        });
        form.style.top = "0%";
        setTimeout(function ()
        {
            form.style.transform = "translate(-50%, 10%)";
        }, 50);
        form.style.padding = "15px";
        form.style.borderRadius = "4px";
        form.style.border = "1px solid rgba(9, 4, 41, 0.9)";
        form.style.boxShadow = "0px 0px 6px 0px rgba(9, 4, 41, 0.9)";
        form.classList.add("popUp" + this.InstanceID);

        if (this.Text != "")
        {
            const head = document.createElement("h2");
            form.appendChild(head);
            head.appendChild(document.createTextNode(this.Text));
            head.style.textAlign = "center";
            head.style.margin = "0px 0px 15px 0px";
            head.style.fontFamily = "Leelawadee";
            head.style.fontSize = "18pt";
            head.style.color = "#090429";
            head.classList.add("popUp" + this.InstanceID);
        }

        const label = document.createElement("p");
        form.appendChild(label);
        label.appendChild(document.createTextNode(this.Content));
        label.style.margin = "0px";
        label.style.fontFamily = "Leelawadee";
        label.style.fontSize = "12pt";
        label.style.fontWeight = "100";
        label.classList.add("popUp" + this.InstanceID);
        
        const backFilter = document.createElement("div");
        document.body.appendChild(backFilter);
        backFilter.style.position = "fixed";
        backFilter.style.zIndex = 9998;
        backFilter.style.width = "100vw";
        backFilter.style.height = "100vh";
        backFilter.id = "backFilter";
        backFilter.classList.add("popUp" + this.InstanceID);
        
        const closeButton = document.createElement("button");
        form.appendChild(closeButton);
        closeButton.style.position = "relative";
        closeButton.style.fontFamily = "Leelawadee";
        closeButton.style.fontSize = "14pt";
        closeButton.style.fontWeight = "500";
        closeButton.style.backgroundColor = "#69a3d8";
        closeButton.style.borderRadius = "4px";
        closeButton.style.float = "right";
        closeButton.style.margin = "15px 0px 0px 15px";
        closeButton.style.border = "none";
        closeButton.style.padding = "5px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "aliceblue";
        closeButton.style.transition = "background-color 0.4s";
        closeButton.classList.add("popUp" + this.InstanceID);
        closeButton.classList.add("noselect");

        const me = this;

        switch (this.Tag)
        {
            case "PRINT":
                if (this.Advanced == true)
                {
                    closeButton.appendChild(document.createTextNode(popUpOk));
                    closeButton.addEventListener("click", () =>
                    {
                        me.Accept();
                        form.style.transform = "translate(-50%, -110%)";
                        document.getElementById("backFilter").remove();
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 500);
                    });
                }
                else
                {
                    backFilter.remove();
                    closeButton.remove();
                    setTimeout(function ()
                    {
                        form.style.opacity = "0";
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 6000);
                    }, 1000 + this.Content.length * 75);
                }
                break;
            case "INPUT":
                if (this.Advanced == true)
                {
                    closeButton.appendChild(document.createTextNode(popUpCancel));
                    closeButton.addEventListener("click", () =>
                    {
                        popUpInput = null;
                        me.Denied();
                        form.style.transform = "translate(-50%, -110%)";
                        document.getElementById("backFilter").remove();
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 500);
                    });

                    const InputField = document.createElement("input");
                    form.appendChild(InputField);
                    form.insertBefore(InputField, closeButton);
                    form.insertBefore(document.createElement("br"), closeButton);
                    InputField.style.position = "relative";
                    InputField.style.top = "5px";
                    InputField.style.fontFamily = "Leelawadee";
                    InputField.style.fontSize = "12pt";
                    InputField.style.boxShadow = "0px 0px 2px 0px rgba(9, 4, 41, 0.9)";
                    InputField.style.border = "solid 1px";
                    InputField.style.borderRadius = "3px";
                    InputField.style.margin = "0px 0px 15px 0px";
                    InputField.type = "text";
                    closeButton.style.marginTop = "0px";

                    const AcceptButton = closeButton.cloneNode(true);
                    form.appendChild(AcceptButton);
                    Array.from(AcceptButton.childNodes).forEach(n => { n.remove(); });
                    AcceptButton.appendChild(document.createTextNode(popUpAccept));
                    AcceptButton.addEventListener("click", () =>
                    {
                        popUpInput = InputField.value;
                        me.Accept();
                        form.style.transform = "translate(-50%, -110%)";
                        document.getElementById("backFilter").remove();
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 500);
                    });
                }
                else
                {
                    closeButton.style.width = "70px";
                    closeButton.appendChild(document.createTextNode(popUpNo));
                    closeButton.addEventListener("click", () =>
                    {
                        popUpInput = false;
                        me.Denied();
                        form.style.transform = "translate(-50%, -110%)";
                        document.getElementById("backFilter").remove();
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 500);
                    });

                    const AcceptButton = closeButton.cloneNode(true);
                    form.appendChild(AcceptButton);
                    Array.from(AcceptButton.childNodes).forEach(n => { n.remove(); });
                    AcceptButton.appendChild(document.createTextNode(popUpYes));
                    AcceptButton.addEventListener("click", () =>
                    {
                        popUpInput = true;
                        me.Accept();
                        form.style.transform = "translate(-50%, -110%)";
                        document.getElementById("backFilter").remove();
                        setTimeout(function ()
                        {
                            me.Hide();
                        }, 500);
                    });
                }
                break
        }
        var codeExtract = "button.popUp" + this.InstanceID + ":hover {\n    background-color: #0085ff !important;\n}\n\nbutton.popUp" + this.InstanceID + ":active {\n    background-color: #0e6abf !important\n}";
        var newExpension = document.createElement('style');
        document.getElementsByTagName('head')[0].appendChild(newExpension);
        if (newExpension.styleSheet)
        {
            newExpension.styleSheet.cssText = codeExtract;
        }
        else
        {
            newExpension.appendChild(document.createTextNode(codeExtract));
        }
        newExpension.classList.add("popUp" + this.InstanceID);

        document.body.insertBefore(form, document.getElementsByTagName("div")[0]);
    }

    Hide ()
    {
        const us = document.getElementsByClassName("popUp" + this.InstanceID);
        for (let i = us.length - 1; i > -1; i--)
        {
            us[i].remove();
        }
    }

    Return (val = null)
    {
        return val;
    }
}