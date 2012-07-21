// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

// List of active dialogs.
var dialogs = [];

// Dialog is a simple 'popup window' displaying a message
// along with some buttons. It is either for informative purposes,
// or to request some sort of confirmation from the user.
function Dialog ()
{
	this.node = document.createElement('div');
	this.node.className = 'dialog';

	this.frame = document.createElement('div');
	this.frame.className = 'frame';
	this.frame.style.left = -10000;
	this.node.appendChild(this.frame);

	this.title = document.createElement('div');
	this.title.className = 'title';
	this.frame.appendChild(this.title);

	this.body = document.createElement('div');
	this.body.className = 'body';
	this.frame.appendChild(this.body);

	this.buttons = document.createElement('div');
	this.buttons.className = 'buttons';
	this.frame.appendChild(this.buttons);

	this.getValue = function () { return null; }
}

// setTitle sets the dialog title.
Dialog.prototype.setTitle = function (title)
{
	return this;
}

// setContent sets the dialog contents.
Dialog.prototype.setContent = function (data)
{
	return this;
}

// onKey handles keyboard input.
Dialog.prototype.onKey = function (e)
{
	var key = (e.which != 0) ? e.which : e.keyCode;

	switch (key) {
	case 27: // escape
		this.close();
	}
}

// open displays the dialog.
Dialog.prototype.open = function ()
{
	dialogs.push(this);

	document.body.appendChild(this.node);
	fx.show(this.node);

	var node = this.frame;
	fx.show(node);

	var sm = fx.metrics();
	var nm = fx.metrics(node);

	fx.move({
		node: node,
		left: -nm.width,
		top:  (sm.height / 2) - (nm.height / 2),
	}).slideTo({
		node:     node,
		left:     (sm.width / 2) - (nm.width / 2),
		duration: 800,
	});

	return this;
}

// close hides the dialog and removes its elements from the DOM.
Dialog.prototype.close = function ()
{
	var n = this.node;
	var m = fx.metrics();

	fx.slideTo({
		node:     this.frame,
		left:     m.width,
		duration: 800,
		onFinish: function ()
		{
			document.body.removeChild(n);
			dialogs.pop();
		}
	});

	return this;
}