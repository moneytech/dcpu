// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

function Dashboard ()
{
	this.items = [];
	this.selectedItem = -1;

	this.node = document.createElement('div');
	this.itemlist = document.createElement('div');
	this.overview = document.createElement('div');

	this.node.id = 'dashboard';
	this.itemlist.className = 'items';
	this.overview.className = 'overview';
	
	this.node.appendChild(this.itemlist);
	this.node.appendChild(this.overview);
	document.body.appendChild(this.node);
}

// init initializes the dashboard and its UI elements.
Dashboard.prototype.init = function (id)
{
	var me = this;

	// Fetch item list.
	this.items = api.request({
		url: "/dashboard/itemlist.js",
		type: 'json',
		async: false,
		onError : function (msg, status)
		{
			console.error('Dashboard.init: Failed to load item list.', status, msg);
		},
	});

	// Create list for item buttons.
	var ul = document.createElement('ul');
	if (!ul) {
		return false;
	}

	// Title of dashboard is in first list element.
	var li = document.createElement('li');
	var h3 = document.createElement('h3');
	h3.innerHTML = AppTitle;
	li.appendChild(h3);
	ul.appendChild(li);

	// Add menu item buttons and pre-load the menu content,
	for (var n = 0; n < this.items.length; n++) {
		var li = document.createElement('li');
		var btn = document.createElement('button');

		btn.id = this.items[n].id;
		btn.title = this.items[n].title;
		btn.innerHTML = btn.title;

		if (this.items[n].key) {
			btn.title += ' (alt+' + this.items[n].key + ')';
		}

		(function(idx)
		{
			btn.onclick = function ()
			{
				me.select(idx);
			}
		}(n));

		li.appendChild(btn);
		ul.appendChild(li);

		// Load external html data.
		var src = this.items[n].src;
		this.items[n].data = api.request({
			refresh: true,
			async: false,
			url: src,
			onError : function (msg, status)
			{
				console.error('Dashboard.init: ',
					src, status, msg);
			},
		});

		// Load external script if need be.
		if (this.items[n].init != undefined) {
			var src = this.items[n].init;
			this.items[n].init = api.request({
				refresh: true,
				async: false,
				type: 'json',
				url: src,
				onError : function (msg, status)
				{
					console.error('Dashboard.init: ',
						src, status, msg);
				},
			});
		}
	}

	this.itemlist.appendChild(ul);

	this.select(0);
	fx.show(this.node);
	return true;
}

// onKey is called whenever a keypress event occurs.
// The parameter holds the key event data.
Dashboard.prototype.onKey = function (e)
{
	if (!e.altKey) {
		return;
	}

	var key = (e.which != 0) ? e.which : e.keyCode;

	switch (key) {
	case 192: // ~
		this.toggle();
		break;
	}

	var ch = String.fromCharCode(key);

	for (var n = 0; n < this.items.length; n++) {
		if (!this.items[n].key) {
			continue;
		}

		if (ch != this.items[n].key) {
			continue;
		}

		if (!fx.isVisible(this.node)) {
			this.toggle();
		}

		this.select(n);
		e.cancelBubble = true;
	}
}

// select changes the currently active dashboard item to the given index.
Dashboard.prototype.select = function (index)
{
	if (index < 0 || index >= this.items.length || this.selectedItem == index) {
		return;
	}

	this.overview.innerHTML = this.items[index].data;

	// Does this panel have initialization code?
	if (this.items[index].init) {
		this.items[index].init();
	}

	// Clear 'active' state on all buttons.
	for (var n = 0; n < this.items.length; n++) {
		var e = document.getElementById(this.items[n].id);
		e.className = '';
	}

	// Set button for current item to 'active'
	var e = document.getElementById(this.items[index].id);
	e.className = 'active';
	this.selectedItem = n;
}

// toggle shows or hides the dashboard using a sliding animation.
Dashboard.prototype.toggle = function ()
{
	var m = fx.metrics(this.node);
	var hide = m.left == 0;
	var node = this.node;

	fx.show(node)
	  .slideTo({
		node:     node,
		left:      hide ? -m.width : 0,
		duration: 500,
		unit:     'px',
		onFinish: function()
		{
			if (hide) {
				fx.hide(node);
			}
		},
	});
}
