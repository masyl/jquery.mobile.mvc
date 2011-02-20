/**
 * Sample app that shows how to use the Dali.MVC api in cunjunction with jQuery mobile.
 * Note that this sample includes a "custom patched" version of jQuery mobile alpha 3
 * This patched version correct a few bug found and shortcomming of alpha 3
 */
(function($) {

	function SampleApp() {
		var app, mvc, Controller;

		// Shortcut variable for the app
		app = this;
		// Create a new instance of the mvc class
		app.mvc = mvc = new Dali.MVC({});
		// Environ will containt application environment variables
		// and be accessible in the templates as "app"
		app.environ = {};
		// Shortcut variable
		Controller = mvc.Controller;

		/**
		 * Attach jQuery.mobile pages to the mvc controllers
		 */
		function attach() {
			$("[data-role='page'][data-controller]").live('pagebeforeshow', function (event, ui) {
				var page, controller, view, model;
				page = $(this);
				controller = page.data("controller");
				view = page.data("view");
				model = {
					app: app.environ,
					params: $.url.parse(ui.url).params
				};
				mvc.run(model, view, controller, output);

				function output(source) {
					page
						.html(source)
						.parent()
						.page()
						.page("refresh");
				}
			});
		}

		/**
		 * Return the list of conrolles for the app
		 */
		function controllers() {
			return {
				home: new Controller("home", function(model, view) {
					return view.render(model);
				}),
				vehicleList: new Controller("vehicleList", function(model, view) {
					model.vehicles = vehicles;
					return view.render(model);
				}),
				vehicleDetail: new Controller("vehicleDetail", function(model, view) {
					// Obtain the vehicle by filtering with the id
					var vehicle = _(vehicles).detect(function(item) {
						// In this case model.params.id is comming from the
						// url used in the querystring
						return item.id === model.params.id;
					});
					model.vehicle = vehicle;
					return view.render(model);
				})
			};
		}

		/**
		 * Start the application
		 */
		app.start = function (environ) {
			// Persist the environment variables
			app.environ = environ;
			// Register all controllers with the mvc
			mvc.register(controllers());
			// Attach jqm pages to the mvc
			attach();
		};
	}

	// Expose the app to the global scope
	window.SampleApp = SampleApp;

})( jQuery );
