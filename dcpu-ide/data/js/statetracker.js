// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

// StateTracker monitors the application's connection to the server.
function StateTracker ()
{
	this.node = document.createElement('div');
	this.node.id = 'statetracker';
	this.node.title = "Not connected to server.";
	document.body.appendChild(this.node);

	this.pingInterval = 5000;
	this.isConnected  = true;
	this.toggle();
	this.poll();
}

// poll issues periodic keep-alive pings and monitors
// if the application is still connected to a server.
StateTracker.prototype.poll = function ()
{
	var me = this;
	var interval = setInterval(function ()
	{
		api.request({
			url: '/api/ping',
			onData : function (data)
			{
				if (!me.isConnected) {
					me.isConnected = true;
					me.toggle();
				}
			},
			onError : function (msg, status)
			{
				if (me.isConnected) {
					me.isConnected = false;
					me.toggle();
				}
			},
		});
	}, this.pingInterval);
}

// toggle shows or hides the state tracker using a sliding animation.
StateTracker.prototype.toggle = function ()
{
	var m = fx.metrics(this.node);
	var hide = this.isConnected;
	var node = this.node;

	fx.show(node)
	  .slideTo({
		node:     node,
		bottom:   hide ? -m.height : 10,
		duration: 1000,
		unit:     'px',
		onFinish: function()
		{
			if (hide) {
				fx.hide(node);
			}
		},
	});
}
