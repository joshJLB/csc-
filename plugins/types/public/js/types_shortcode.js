/**
 * API and helper functions for the GUI on Types shortcodes.
 *
 * @since m2m
 * @package Types
 */

var Toolset = Toolset || {};

if ( typeof Toolset.Types === "undefined" ) {
	Toolset.Types = {};
}

/*
 * -------------------------------------
 * Shortcode GUI
 * -------------------------------------
 */

Toolset.Types.shortcodeManager = function( $ ) {
	
	var self = this;
	
	/**
	 * Shortcodes GUI API version.
	 *
	 * Access to it using the API methods, from inside this object:
	 * - self.getShortcodeGuiApiVersion
	 * 
	 * Access to it using the API hooks, from the outside world:
	 * - types-filter-get-shortcode-gui-api-version
	 *
	 * @since m2m
	 */
	self.apiVersion = 193000;
	
	/**
	 * Get the current shortcodes GUI API version.
	 *
	 * @see types-filter-get-shortcode-gui-api-version
	 *
	 * @since m2m
	 */
	self.getShortcodeGuiApiVersion = function( version ) {
		return self.apiVersion;
	};
	
	/**
	 * Register the canonical Toolset hooks, both API filters and actions.
	 *
	 * @since m2m
	 */
	self.initHooks = function() {
		
		/*
		 * ###############################
		 * API filters
		 * ###############################
		 */
		
		/**
		 * Return the current shortcodes GUI API version.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addFilter( 'types-filter-get-shortcode-gui-api-version', self.getShortcodeGuiApiVersion );
		
		/**
		 * Clean the list of attributes from metaXXX helpers.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addFilter( 'toolset-filter-shortcode-gui-types-computed-attribute-values', self.cleanTypesAttributes );
		
		/**
		 * Clean the list of attributes depending on the field type and the attributes selected.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addFilter( 'toolset-filter-shortcode-gui-types-computed-attribute-values', self.adjustAttributes, 20, 2 );
		
		/**
		 * Adjust the attributes based on the item selector values.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addFilter( 'toolset-filter-shortcode-gui-types-computed-attribute-values', self.adjustTypesMetaSelectorAttributes, 30, 2 );
		
		/**
		 * Generate complex shortcodes for checkbox, checkboxes and radio field when producing custom output per option.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addFilter( 'toolset-filter-shortcode-gui-types-crafted-shortcode', self.adjustComposedShortcodes, 10, 2 );
		
		/*
		 * ###############################
		 * API actions
		 * ###############################
		 */
		
		/**
		 * OPen the Types shortcode dialog on demand, given a set of data.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addAction( 'types-action-shortcode-dialog-do-open', self.shortcodeDialogOpen );
		
		/**
		 * Set the right dialog buttonpane buttons labels, after the dialog is opened, based on the current GUI action.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addAction( 'types-action-shortcode-dialog-preloaded', self.manageShortcodeDialogButtonpane );
		
		/**
		 * Set override values on Types shortcode dialogs.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addAction( 'types-action-shortcode-dialog-loaded', self.manageEditingOverrides );
		
		/**
		 * Generate extra attributes for field types that support custom output per option.
		 *
		 * @since m2m
		 */
		Toolset.hooks.addAction( 'types-action-shortcode-dialog-loaded', self.manageMetaoptions );
		
		return self;
		
	};
	
	/**
	 * Init GUI templates.
	 *
	 * @uses wp.template
	 * @since m2m
	 */
	self.templates = {};
	self.initTemplates = function() {
		
		// Registers the typesUserSelector, typesViewsUserSelector, typesViewsTermSelector templates in the shared pool
		Toolset.hooks.doAction( 'toolset-filter-register-shortcode-gui-attribute-template', 'typesUserSelector', wp.template( 'toolset-shortcode-attribute-typesUserSelector' ) );
		Toolset.hooks.doAction( 'toolset-filter-register-shortcode-gui-attribute-template', 'typesViewsUserSelector', wp.template( 'toolset-shortcode-attribute-typesViewsUserSelector' ) );
		Toolset.hooks.doAction( 'toolset-filter-register-shortcode-gui-attribute-template', 'typesViewsTermSelector', wp.template( 'toolset-shortcode-attribute-typesViewsTermSelector' ) );
		
		// Gets the shared pool
		self.templates = _.extend( Toolset.hooks.applyFilters( 'toolset-filter-get-shortcode-gui-templates', {} ), self.templates );
		
		// Register custom templates for local usage
		if ( ! _.has( self.templates, 'info' ) ) {
			self.templates.info = {};
		}
		self.templates.info.postReferenceFieldWizard = [
			wp.template( 'toolset-shortcode-attribute-info-postReferenceField' ),
			wp.template( 'toolset-shortcode-attribute-info-postReferenceFieldWizardFirst' ),
			wp.template( 'toolset-shortcode-attribute-info-postReferenceFieldWizardSecond' ),
			wp.template( 'toolset-shortcode-attribute-info-postReferenceFieldWizardThird' )
		];
		self.templates.info.RFGWizard = [
			wp.template( 'toolset-shortcode-attribute-info-RFG' ),
			wp.template( 'toolset-shortcode-attribute-info-RFGFirst' ),
			wp.template( 'toolset-shortcode-attribute-info-RFGSecond' ),
			wp.template( 'toolset-shortcode-attribute-info-RFGThird' )
		];
		
		return self;
		
	}
	
	/**
	 * Init GUI dialogs.
	 *
	 * @uses jQuery.dialog
	 * @since m2m
	 */
	self.dialogs = {};
	self.dialogs.main = null;
	self.dialogs.shortcode = null;
	self.dialogs.postFieldInfoWizard = null;
	
	self.shortcodeDialogSpinnerContent = $(
		'<div style="min-height: 150px;">' +
		'<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; ">' +
		'<div class="ajax-loader"></div>' +
		'<p>' + types_shortcode_i18n.action.loading + '</p>' +
		'</div>' +
		'</div>'
	);
	
	self.initDialogs = function() {
		
		/**
		 * Main dialog to list the available shortcodes.
		 *
		 * @since m2m
		 */
		if ( ! $( '#js-types-shortcode-gui-dialog-container-main' ).length ) {
			$( 'body' ).append( '<div id="js-types-shortcode-gui-dialog-container-main" class="toolset-shortcode-gui-dialog-container js-toolset-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container-main"></div>' );
		}
		self.dialogs.main = $( '#js-types-shortcode-gui-dialog-container-main' ).dialog({
			dialogClass: 'toolset-ui-dialog toolset-ui-dialog-responsive',
			autoOpen:	false,
			modal:		true,
			width:		'90%',
			title:		types_shortcode_i18n.title.dialog,
			resizable:	false,
			draggable:	false,
			show: {
				effect:		"blind",
				duration:	800
			},
			open: function( event, ui ) {
				$( 'body' ).addClass('modal-open');
				self.repositionDialog();
			},
			close: function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			}
		});
		
		/**
		 * Canonical dialog to insert shortcodes.
		 *
		 * @since m2m
		 */
		if ( ! $( '#js-types-shortcode-gui-dialog-container-shortcode' ).length ) {
			$( 'body' ).append( '<div id="js-types-shortcode-gui-dialog-container-shortcode" class="toolset-shortcode-gui-dialog-container js-toolset-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container-shortcode"></div>' );
		}
		self.dialogs.shortcode = $( "#js-types-shortcode-gui-dialog-container-shortcode" ).dialog({
			dialogClass: 'toolset-ui-dialog toolset-ui-dialog-responsive',
			autoOpen:	false,
			modal:		true,
			width:		'90%',
			resizable:	false,
			draggable:	false,
			show: {
				effect:		"blind",
				duration:	800
			},
			open: function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.repositionDialog();
			},
			close: function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class: 'toolset-shortcode-gui-dialog-button-align-right button-primary js-types-shortcode-gui-button-craft',
					text: types_shortcode_i18n.action.insert,
					click: function() {
						var shortcodeToInsert = Toolset.hooks.applyFilters( 'toolset-filter-get-crafted-shortcode', false, $( '#js-types-shortcode-gui-dialog-container-shortcode' ) );
						// shortcodeToInsert will fail on validtion failure
						if ( shortcodeToInsert ) {
							$( this ).dialog( "close" );
							Toolset.hooks.doAction( 'toolset-action-do-shortcode-gui-action', shortcodeToInsert );
						}
					}
				},
				{
					class: 'toolset-shortcode-gui-dialog-button-align-right button-secondary toolset-shortcode-gui-dialog-button-back js-types-shortcode-gui-button-back',
					text: types_shortcode_i18n.action.back,
					click: function() {
						$( this ).dialog( "close" );
						// Open the Types main dialog, or the Fields and Views dialog if Views is active
						self.openMainDialog();
					}
				},
				{
					class: 'button-secondary toolset-shortcode-gui-dialog-button-close js-types-shortcode-gui-button-close',
					text: types_shortcode_i18n.action.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});
		
		/**
		 * Information wizard dialog about post reference fields.
		 *
		 * @since m2m
		 */
		if ( ! $( '#js-types-shortcode-gui-dialog-container-post-field-info-wizard' ).length ) {
			$( 'body' ).append( '<div id="js-types-shortcode-gui-dialog-container-post-field-info-wizard" class="toolset-shortcode-gui-dialog-container js-toolset-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container-post-field-info-wizard"></div>' );
		}
		self.dialogs.postFieldInfoWizard = $( "#js-types-shortcode-gui-dialog-container-post-field-info-wizard" ).dialog({
			dialogClass: 'toolset-ui-dialog toolset-ui-dialog-responsive',
			autoOpen:	false,
			modal:		true,
			width:		'90%',
			resizable:	false,
			draggable:	false,
			show: {
				effect:		"blind",
				duration:	800
			},
			wizardStep: 0,
			open: function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.repositionDialog();
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).hide();
				$( '.js-types-shortcode-gui-button-pfiw-next .ui-button-text' ).html( types_shortcode_i18n.action.wizard );
				$( this ).dialog( "option", "wizardStep", 0 );
			},
			close: function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class: 'toolset-shortcode-gui-dialog-button-align-right button-primary js-types-shortcode-gui-button-pfiw-next',
					text: types_shortcode_i18n.action.wizard,
					click: function() {
						self.postFieldInfoWizardNext();
					}
				},
				{
					class: 'button-secondary js-types-shortcode-gui-button-pfiw-previous',
					text: types_shortcode_i18n.action.previous,
					click: function() {
						self.postFieldInfoWizardPrevious();
					}
				}
			]
		});
		
		/**
		 * Information wizard dialog about post reference fields.
		 *
		 * @since m2m
		 */
		if ( ! $( '#js-types-shortcode-gui-dialog-container-rfg-info-wizard' ).length ) {
			$( 'body' ).append( '<div id="js-types-shortcode-gui-dialog-container-rfg-info-wizard" class="toolset-shortcode-gui-dialog-container js-toolset-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container js-types-shortcode-gui-dialog-container-rfg-info-wizard"></div>' );
		}
		self.dialogs.RFGInfoWizard = $( "#js-types-shortcode-gui-dialog-container-rfg-info-wizard" ).dialog({
			dialogClass: 'toolset-ui-dialog toolset-ui-dialog-responsive',
			autoOpen:	false,
			modal:		true,
			width:		'90%',
			resizable:	false,
			draggable:	false,
			show: {
				effect:		"blind",
				duration:	800
			},
			wizardStep: 0,
			open: function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.repositionDialog();
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).hide();
				$( this ).dialog( "option", "wizardStep", 0 );
			},
			close: function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class: 'toolset-shortcode-gui-dialog-button-align-right button-primary js-types-shortcode-gui-button-rfgiw-next',
					text: types_shortcode_i18n.action.wizard,
					click: function() {
						self.RFGInfoWizardStepNext();
					}
				},
				{
					class: 'button-secondary js-types-shortcode-gui-button-rfgiw-previous',
					text: types_shortcode_i18n.action.previous,
					click: function() {
						self.RFGInfoWizardStepPrevious();
					}
				}
			]
		});
		
		$( window ).resize( self.resizeWindowEvent );
		
		return self;
		
	}
	
	/**
	 * Callback for the window.resize event.
	 *
	 * @since m2m
	 */
	self.resizeWindowEvent = _.debounce( function() {
		self.repositionDialog();
	}, 200);

	/**
	 * Reposition the Types dialogs based on the current window size.
	 *
	 * @since m2m
	 */
	self.repositionDialog = function() {
		var winH = $( window ).height() - 100;
		self.dialogs.main.dialog( "option", "maxHeight", winH );
		self.dialogs.shortcode.dialog( "option", "maxHeight", winH );
		self.dialogs.postFieldInfoWizard.dialog( "option", "maxHeight", winH );
		self.dialogs.RFGInfoWizard.dialog( "option", "maxHeight", winH );

		self.dialogs.main.dialog( "option", "position", {
			my:        "center top+50",
			at:        "center top",
			of:        window,
			collision: "none"
		});
		self.dialogs.shortcode.dialog( "option", "position", {
			my:        "center top+50",
			at:        "center top",
			of:        window,
			collision: "none"
		});
		self.dialogs.postFieldInfoWizard.dialog( "option", "position", {
			my:        "center top+50",
			at:        "center top",
			of:        window,
			collision: "none"
		});
		self.dialogs.RFGInfoWizard.dialog( "option", "position", {
			my:        "center top+50",
			at:        "center top",
			of:        window,
			collision: "none"
		});
	};
	
	/**
	 * Open the main dialog to offer shortcodes, which can be the Types one, or the Fields and Views if Views is active.
	 *
	 * @since m2m
	 */
	self.openMainDialog = function() {
		if ( types_shortcode_i18n.conditions.plugins.toolsetViews ) {
			Toolset.hooks.doAction( 'wpv-action-wpv-fields-and-views-dialog-do-open' );
		} else {
			self.openTypesDialog();
		}
	};
	
	/**
	 * Open the main Types dialog to offer shortcodes.
	 *
	 * @since m2m
	 */
	self.openTypesDialog = function() {
		self.dialogs.main.dialog( 'open' );
	}
	
	/**
	 * Init the Admin Bar button, if any.
	 *
	 * @since m2m
	 */
	self.initAdminBarButton = function() {
		if ( $( '.js-types-shortcode-generator-node a' ).length > 0 ) {
			$( '.js-types-shortcode-generator-node a' ).addClass( 'js-types-in-adminbar' );
		}
	};
	
	/**
	 * Set the right active editor and action when clicking any button, and open the main dialog.
	 *
	 * Acceptable selectors to trigger actions are:
	 * - Admin Bar: .js-types-in-adminbar
	 * - Editor Toolbar: .js-types-in-toolbar
	 *
	 * @since m2m
	 */
	$( document ).on( 'click','.js-types-in-adminbar', function( e ) {
		e.preventDefault();
		
		Toolset.hooks.doAction( 'toolset-action-set-shortcode-gui-action', 'create' );
		self.openTypesDialog();
		
		return false;
	});
	$( document ).on( 'click', '.js-types-in-toolbar', function( e ) {
		e.preventDefault();
		
		var typesInToolbarButton = $( this );
		if ( typesInToolbarButton.attr( 'data-editor' ) ) {
			window.wpcfActiveEditor = typesInToolbarButton.data( 'editor' );
		}
		
		Toolset.hooks.doAction( 'toolset-action-set-shortcode-gui-action', 'insert' );
		self.openTypesDialog();
		
		return false;
	});
	
	/**
	 * Close the main dialog when clicking on any of its items.
	 *
	 * @since m2m
	 */
	$( document ).on( 'click', '.js-types-shortcode-gui-group-list .js-types-shortcode-gui', function( e ) {
		e.preventDefault();
		
		if ( self.dialogs.main.dialog( "isOpen" ) ) {
			self.dialogs.main.dialog('close');
		}
	});
	
	/**
	 * Manage the steps and buttons in the post reference information wizard dialog.
	 *
	 * @param step int
	 *
	 * @since m2m
	 */
	self.postFieldInfoWizardStep = function( step ) {
		if ( ! _.contains( [0, 1, 2, 3], step ) ) {
			return;
		}
		var dialogData = self.dialogs.postFieldInfoWizard.dialog( "option", "wizardData" );
		switch( step ) {
			case 0:
				self.dialogs.postFieldInfoWizard.dialog( 'open' ).dialog({
					title: dialogData.title
				});
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).hide();
				$( '.js-types-shortcode-gui-button-pfiw-next .ui-button-text' ).html( types_shortcode_i18n.action.wizard );
				//self.dialogs.postFieldInfoWizard.html( self.templates.info.postReferenceFieldWizard[0]( dialogData ) );
				break;
			case 1:
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).hide();
				$( '.js-types-shortcode-gui-button-pfiw-next .ui-button-text' ).html( types_shortcode_i18n.action.next );
				break;
			case 2:
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).show();
				$( '.js-types-shortcode-gui-button-pfiw-next .ui-button-text' ).html( types_shortcode_i18n.action.next );
				break;
			case 3:
				$( '.js-types-shortcode-gui-button-pfiw-previous' ).show();
				$( '.js-types-shortcode-gui-button-pfiw-next .ui-button-text' ).html( types_shortcode_i18n.action.got_it );
				break;
		}
		self.dialogs.postFieldInfoWizard.html( self.templates.info.postReferenceFieldWizard[ step ]( dialogData ) );
		self.dialogs.postFieldInfoWizard.dialog( "option", "wizardStep", step );
	};
	
	/**
	 * Manage the Next button click in the post reference information wizard dialog.
	 *
	 * After the last step, reopen the main dialog when inserting/creating/appending a shortcode.
	 * Just close the wizard in any other scenario, like when editing or skipping a shortcode, 
	 * or when in the Views loop wizard.
	 *
	 * @since m2m
	 */
	self.postFieldInfoWizardNext = function() {
		var currentWizardStep = self.dialogs.postFieldInfoWizard.dialog( "option", "wizardStep" ),
			comingWizardStep = currentWizardStep + 1;
		
		if ( comingWizardStep > 3 ) {
			self.dialogs.postFieldInfoWizard.dialog( "close" );
			if ( _.contains( [ 'insert', 'create', 'append' ], Toolset.hooks.applyFilters( 'toolset-filter-get-shortcode-gui-action', '' ) ) ) {
				self.openMainDialog();
			}
			return;
		}
		self.postFieldInfoWizardStep( comingWizardStep );
	};
	
	/**
	 * Manage the Previous button lick in the post reference information wizard dialog.
	 *
	 * @since m2m
	 */
	self.postFieldInfoWizardPrevious = function() {
		var currentWizardStep = self.dialogs.postFieldInfoWizard.dialog( "option", "wizardStep" ),
			comingWizardStep = currentWizardStep - 1;
		if ( comingWizardStep < 1 ) {
			comingWizardStep = 1;
		}
		self.postFieldInfoWizardStep( comingWizardStep );	
	};
	
	/**
	 * Manage the steps and buttons in the repeating fields groups information wizard dialog.
	 *
	 * @param step int
	 *
	 * @since m2m
	 */
	self.RFGInfoWizardStep = function( step ) {
		if ( ! _.contains( [0, 1, 2, 3], step ) ) {
			return;
		}
		var dialogData = self.dialogs.RFGInfoWizard.dialog( "option", "wizardData" );
		switch( step ) {
			case 0:
				self.dialogs.RFGInfoWizard.dialog( 'open' ).dialog({
					title: dialogData.title
				});
				$( '.js-types-shortcode-gui-button-rfgiw-previous' ).hide();
				if ( types_shortcode_i18n.conditions.plugins.toolsetViews ) {
					$( '.js-types-shortcode-gui-button-rfgiw-next .ui-button-text' ).html( types_shortcode_i18n.action.wizard );
				} else {
					$( '.js-types-shortcode-gui-button-rfgiw-next .ui-button-text' ).html( types_shortcode_i18n.action.close );
				}
				//self.dialogs.RFGInfoWizard.html( self.templates.info.RFGWizard[0]( dialogData ) );
				break;
			case 1:
				$( '.js-types-shortcode-gui-button-rfgiw-previous' ).hide();
				$( '.js-types-shortcode-gui-button-rfgiw-next .ui-button-text' ).html( types_shortcode_i18n.action.next );
				break;
			case 2:
				$( '.js-types-shortcode-gui-button-rfgiw-previous' ).show();
				$( '.js-types-shortcode-gui-button-rfgiw-next .ui-button-text' ).html( types_shortcode_i18n.action.next );
				break;
			case 3:
				$( '.js-types-shortcode-gui-button-rfgiw-previous' ).show();
				$( '.js-types-shortcode-gui-button-rfgiw-next .ui-button-text' ).html( types_shortcode_i18n.action.got_it );
				break;
		}
		self.dialogs.RFGInfoWizard.html( self.templates.info.RFGWizard[ step ]( dialogData ) );
		self.dialogs.RFGInfoWizard.dialog( "option", "wizardStep", step );
	};
	
	/**
	 * Manage the Next button click in the repeating fields groups information wizard dialog.
	 *
	 * After the last step, reopen the main dialog when inserting/creating/appending a shortcode.
	 * Just close the wizard in any other scenario, like when editing or skipping a shortcode, 
	 * or when in the Views loop wizard.
	 *
	 * @since m2m
	 */
	self.RFGInfoWizardStepNext = function() {
		var currentWizardStep = self.dialogs.RFGInfoWizard.dialog( "option", "wizardStep" ),
			comingWizardStep = currentWizardStep + 1;
		
		if (
			currentWizardStep == 0
			&& ! types_shortcode_i18n.conditions.plugins.toolsetViews
		) {
			self.dialogs.RFGInfoWizard.dialog( "close" );
			return;
		}
		
		if ( comingWizardStep > 3 ) {
			self.dialogs.RFGInfoWizard.dialog( "close" );
			return;
		}
		self.RFGInfoWizardStep( comingWizardStep );
	};
	
	/**
	 * Manage the Previous button lick in the repeating fields groups information wizard dialog.
	 *
	 * @since m2m
	 */
	self.RFGInfoWizardStepPrevious = function() {
		var currentWizardStep = self.dialogs.RFGInfoWizard.dialog( "option", "wizardStep" ),
			comingWizardStep = currentWizardStep - 1;
		if ( comingWizardStep < 1 ) {
			comingWizardStep = 1;
		}
		self.RFGInfoWizardStep( comingWizardStep );	
	};
	
	/**
	 * Display a dialog for inserting a generic shortcode.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *
	 * @since m2m
	 */
	self.shortcodeDialogOpen = function( dialogData ) {
		
		// Race condition:
		// We close the main dialog before opening the shortcode dialog, 
		// so we can keep the .modal-open classname in the document body, to:
		// - avoid scrolling
		// - prevent positioning issues with toolset_select2
		if ( self.dialogs.main.dialog( "isOpen" ) ) {
			self.dialogs.main.dialog('close');
		}
		Toolset.hooks.doAction( 'wpv-action-wpv-fields-and-views-dialog-do-maybe-close' );
		
		_.defaults( dialogData, { 
			parameters: {}, 
			overrides: {}, 
			dialog: self.dialogs.shortcode, 
			conditions: types_shortcode_i18n.conditions 
		});
		
		if ( ! _.has( dialogData.parameters, 'metaType' )  ) {
			dialogData.parameters.metaType = 'typesGenericType';
		}
		
		// Post reference fields should not be insertable: fire the info wizard
		if ( 'post' === dialogData.parameters.metaType ) {
			self.dialogs.postFieldInfoWizard.dialog( "option", "wizardData", dialogData );
			self.postFieldInfoWizardStep( 0 );
			return;
		}
		
		// Repeating Field Groups fields should not be insertable: fire the info wizard
		if ( 'repeatable_field_group' === dialogData.parameters.metaType ) {
			self.dialogs.RFGInfoWizard.dialog( "option", "wizardData", dialogData );
			self.RFGInfoWizardStep( 0 );
			return;
		}
		
		/**
		 * Toolset hooks action: shortcode dialog requested. Types and shared versions.
		 *
		 * Nothing has happened yet, we just got a request to open the shortcode dialog.
		 *
		 * @since m2m
		 */
		Toolset.hooks.doAction( 'types-action-shortcode-dialog-requested', dialogData );
		Toolset.hooks.doAction( 'toolset-action-shortcode-dialog-requested', dialogData );
		
		// Show the "empty" dialog with a spinner while loading dialog content
		self.dialogs.shortcode.dialog( 'open' ).dialog({
			title: dialogData.title
		});
		self.dialogs.shortcode.html( self.shortcodeDialogSpinnerContent );

		/**
		 * Toolset hooks action: shortcode dialog preloaded. Types and shared versions.
		 *
		 * The dialog is open and contains a spinner.
		 *
		 * @since m2m
		 */
		Toolset.hooks.doAction( 'types-action-shortcode-dialog-preloaded', dialogData );
		Toolset.hooks.doAction( 'toolset-action-shortcode-dialog-preloaded', dialogData );
		
		// Warning!! The shortcodes data is stored in types_shortcode_i18n, 
		// but assigning any of the objects it contains is done by reference 
		// so it would modify permanently the original set.
		// Using $.extend with deep cloning.
		var typesShortcodeData = $.extend( true, {}, types_shortcode_i18n );
		
		// Load the specific field type attributes definitions, or a generic set
		if ( _.has( typesShortcodeData.attributes, dialogData.parameters.metaType ) ) {
			var shortcodeAttributes = typesShortcodeData.attributes[ dialogData.parameters.metaType ];
		} else {
			var shortcodeAttributes = typesShortcodeData.attributes[ 'typesGenericType' ];
		}
		
		// Inject the attributes for repeating fields
		if ( 'multiple' == dialogData.parameters.metaNature ) {
			if ( _.isEmpty( shortcodeAttributes.displayOptions.fields ) ) {
				shortcodeAttributes.displayOptions.fields = typesShortcodeData.repeatingAttributes;
			} else {
				shortcodeAttributes.displayOptions.fields = _.extend(
					shortcodeAttributes.displayOptions.fields,
					typesShortcodeData.repeatingAttributes
				);
			}
		}
		
		// All Types shortcodes require an item selector and a closing tag
		if ( 'posts' == dialogData.parameters.metaDomain ) {
			shortcodeAttributes = _.extend(
				shortcodeAttributes,
				Toolset.hooks.applyFilters( 'toolset-filter-get-shortcode-gui-postSelector-attributes', {} )
			);
			shortcodeAttributes.postSelector.fields.content = { type: 'content', hidden: true };
		} else if ( 'terms' == dialogData.parameters.metaDomain ) {
			shortcodeAttributes = _.extend(
				shortcodeAttributes,
				{ typesViewsTermSelector: typesShortcodeData.selectorGroups.typesViewsTermSelector }
			);
			shortcodeAttributes.typesViewsTermSelector.fields.content = { type: 'content', hidden: true };
		} else if ( 'users' == dialogData.parameters.metaDomain ) {
			if ( 'users' == Toolset.hooks.applyFilters( 'wpv-filter-wpv-shortcodes-gui-get-gui-target', 'posts' ) ) {
				shortcodeAttributes = _.extend(
					shortcodeAttributes,
					{ typesViewsUserSelector: typesShortcodeData.selectorGroups.typesViewsUserSelector }
				);
				shortcodeAttributes.typesViewsUserSelector.fields.content = { type: 'content', hidden: true };
			} else {
				shortcodeAttributes = _.extend(
					shortcodeAttributes,
					{ typesUserSelector: typesShortcodeData.selectorGroups.typesUserSelector }
				);
				shortcodeAttributes.typesUserSelector.fields.content = { type: 'content', hidden: true };
			}
		}
		
		// Add the templates and attributes to the main set of data, and render the dialog
		var templateData = _.extend( 
			dialogData, 
			{
				templates:  self.templates,
				attributes: shortcodeAttributes
			}
		);
		
		self.dialogs.shortcode.html( self.templates.dialog( templateData ) );
		
		// Initialize the dialog tabs, if needed
		if ( self.dialogs.shortcode.find( '.js-toolset-shortcode-gui-tabs-list > li' ).length > 1 ) {
			self.dialogs.shortcode.find( '.js-toolset-shortcode-gui-tabs' )
				.tabs({
					beforeActivate: function( event, ui ) {
						
						var valid = Toolset.hooks.applyFilters( 'toolset-filter-is-shortcode-attributes-container-valid', true, ui.oldPanel );
						if ( ! valid ) {
							event.preventDefault();
							ui.oldTab.focus().addClass( 'toolset-shortcode-gui-tabs-incomplete' );
							setTimeout( function() {
								ui.oldTab.removeClass( 'toolset-shortcode-gui-tabs-incomplete' );
							}, 1000 );
						}
					}
				})
				.addClass( 'ui-tabs-vertical ui-helper-clearfix' )
				.removeClass( 'ui-corner-top ui-corner-right ui-corner-bottom ui-corner-left ui-corner-all' );
			$( '#js-toolset-shortcode-gui-dialog-tabs ul, #js-toolset-shortcode-gui-dialog-tabs li' )
				.removeClass( 'ui-corner-top ui-corner-right ui-corner-bottom ui-corner-left ui-corner-all');
		} else {
			self.dialogs.shortcode.find( '.js-toolset-shortcode-gui-tabs-list' ).remove();
		}
		
		/**
		 * Toolset hooks action: shortcode dialog loaded. Types, Types specific per field type, and shared versions.
		 *
		 * The dialog is open and contains the attributes GUI.
		 *
		 * @since m2m
		 */
		Toolset.hooks.doAction( 'types-action-shortcode-dialog-loaded', dialogData );
		if ( _.has( dialogData.parameters, 'metaType' ) ) {
			Toolset.hooks.doAction( 'types-action-shortcode-' + dialogData.parameters.metaType + '-dialog-loaded', dialogData );
		}
		Toolset.hooks.doAction( 'toolset-action-shortcode-dialog-loaded', dialogData );
		
	};
	
	/**
	 * Manage existing attribute values when opening the shortcode dialog for editing it.
	 *
	 * Currently used by the Views loop wizard as it injects existing attribute values when editing.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *         attributes  object Pairs of attribute key and value to force in.
	 *         content     string Shortcode content to force in.
	 *     dialog     dialog jQuery UI dialog object.
	 *
	 * @since m2m
	 */
	self.manageEditingOverrides = function( dialogData ) {
		if ( _.has( dialogData.overrides, 'attributes' ) ) {
			_.each( dialogData.overrides.attributes, function( value, key, list ) {
				if ( dialogData.dialog.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-' + key ).length > 0 ) {
					var attribute_wrapper = dialogData.dialog.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-' + key ),
						attribute_type = attribute_wrapper.data( 'type' );
					switch ( attribute_type ) {
						case 'select':
						case 'select2':
							if ( attribute_wrapper.find( '.js-shortcode-gui-field option[value="' + value + '"]' ).length != 0 ) {
								attribute_wrapper.find( '.js-shortcode-gui-field' ).val( value ).trigger( 'change' );
							}
							break;
						case 'radio':
							if ( attribute_wrapper.find( '.js-shortcode-gui-field[value="' + value + '"]' ).length != 0 ) {
								attribute_wrapper.find( '.js-shortcode-gui-field[value="' +  value + '"]' ).prop( 'checked', true ).trigger( 'change' );
							}
							break;
						case 'number':
						case 'text':
						case 'url':
						case 'fixed':
							attribute_wrapper.find( '.js-shortcode-gui-field' ).val( value ).trigger( 'change ');
							break;
						case 'textarea':
							// @todo check this
							attribute_wrapper.find( '.js-shortcode-gui-field' ).val( value ).trigger( 'change' );
							break;
							
					}
				} else {
					//data.dialog.find( '.wpv-dialog' ).prepend( '<span class="wpv-shortcode-gui-attribute-wrapper js-wpv-shortcode-gui-attribute-wrapper js-wpv-shortcode-gui-attribute-wrapper-for-' + key + '" data-attribute="' + key + '" data-type="param"><input type="hidden" name="' + key + '" value="' + value + '" disabled="disabled" /></span>' );
				}				
			});
		}
		if ( 
			_.has( dialogData.overrides, 'content' )
			&& dialogData.overrides.content !== undefined
		) {
			// @todo check this
			dialogData.dialog.find( '.js-toolset-shortcode-gui-content' ).val( dialogData.overrides.content );
		}
	};
	
	/**
	 * Generate extra attributes for field types that support custom output per option.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *         attributes  object Pairs of attribute key and value to force in.
	 *         content     string Shortcode content to force in.
	 *     dialog     dialog jQuery UI dialog object.
	 *
	 * @since m2m
	 */
	self.manageMetaoptions = function( dialogData ) {
		if ( _.has( dialogData.parameters, 'metaOptions' ) ) {
			
			dialogData.dialog
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-metaOptions input' )
					.data( 'metaOptions', dialogData.parameters.metaOptions );
			
			if ( 'radio' == dialogData.parameters.metaType ) {
				self.manageMetaoptionsForRadio( dialogData );
			}
			if ( 'checkboxes' == dialogData.parameters.metaType ) {
				self.manageMetaoptionsForCheckboxes( dialogData );
			}
			
		}
	};
	
	/**
	 * Generate extra attributes for radio fields.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *         attributes  object Pairs of attribute key and value to force in.
	 *         content     string Shortcode content to force in.
	 *     dialog     dialog jQuery UI dialog object.
	 *
	 * @since m2m
	 */
	self.manageMetaoptionsForRadio = function( dialogData ) {
		var combo = dialogData.dialog.find( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo .js-toolset-shortcode-gui-dialog-item-group' ).detach(),//$( '.js-toolset-shortcode-gui-dialog-item-group', '.js-toolset-shortcode-gui-attribute-wrapper-for-outputCustomCombo' ).detach(),
			container = $( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo' );
		
		_.each( dialogData.parameters.metaOptions, function( value, key, list ) {
			var comboClone = combo.clone();
			
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue' )
					.attr( 'data-attribute', 'selectedValue_' + key );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue input.js-shortcode-gui-field' )
					.attr( 'id', 'types_selectedValue_' + key );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue strong' )
					.html( function( index, html ) {
						return html.replace( '%%OPTION%%', value.title );
					});
			comboClone.appendTo( container );
		});
	};
	
	/**
	 * Generate extra attributes for checkboxes fields.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *         attributes  object Pairs of attribute key and value to force in.
	 *         content     string Shortcode content to force in.
	 *     dialog     dialog jQuery UI dialog object.
	 *
	 * @since m2m
	 */
	self.manageMetaoptionsForCheckboxes = function( dialogData ) {
		var combo = dialogData.dialog.find( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo .js-toolset-shortcode-gui-dialog-item-group' ).detach(),//$( '.js-toolset-shortcode-gui-dialog-item-group', '.js-toolset-shortcode-gui-attribute-wrapper-for-outputCustomCombo' ).detach(),
			container = $( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo' ),
			eachIndex = 0;
		
		_.each( dialogData.parameters.metaOptions, function( value, key, list ) {
			var comboClone = combo.clone();
			
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue' )
					.attr( 'data-attribute', 'selectedValue_' + eachIndex );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue input.js-shortcode-gui-field' )
					.attr( 'id', 'types_selectedValue_' + eachIndex );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-selectedValue strong' )
					.html( function( index, html ) {
						return html.replace( '%%OPTION%%', value.title );
					});
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-unselectedValue' )
					.attr( 'data-attribute', 'unselectedValue_' + eachIndex );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-unselectedValue input.js-shortcode-gui-field' )
					.attr( 'id', 'types_unselectedValue_' + eachIndex );
			comboClone
				.find( '.js-toolset-shortcode-gui-attribute-wrapper-for-unselectedValue strong' )
					.html( function( index, html ) {
						return html.replace( '%%OPTION%%', value.title );
					});
			comboClone.appendTo( container );
			eachIndex++;
		});
	};
	
	/**
	 * Manage the attributes GUI based on the "output" attribte value.
	 *
	 * @since m2m
	 * @todo Split in specific methods per field type
	 */
	$( document ).on( 'change', '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-output]', function() {
		var metaType = $( '#js-types-shortcode-gui-dialog-container-shortcode input[name=metaType]' ).val(),
			checkedValue = $( '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-output]:checked' ).val(),
			dialogContainer = $( '#js-types-shortcode-gui-dialog-container-shortcode' );
		
		switch ( metaType ) {
			case 'audio':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-preload', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-loop', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-autoplay', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-preload', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-loop', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-autoplay', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'checkbox':
				if ( 'custom' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideDown( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideUp( 'fast' );
				}
				break;
			
			case 'checkboxes':
				if ( 'custom' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-separator', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-separator', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'date':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-style', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:format', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-style', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-style input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
				}
				break;
			
			case 'email':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'embed':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'file':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'image':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-titleAltCombo', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-align', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-size', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-resize', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:padding_color', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideUp( 'fast' );
				} else if ( 'url' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-titleAltCombo', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-align', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-size', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-size input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-titleAltCombo', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-align', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-size', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-size input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'numeric':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'radio':
				if ( 'raw' == checkedValue || 'normal' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-outputCustomCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'skype':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-button_style', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-class', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-button_style', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-class', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'url':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-target', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:target', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-title', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-target', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-target input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-attributesCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
			
			case 'video':
				if ( 'raw' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-poster', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-preload', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-loop', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-autoplay', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-poster', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-preload', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-loop', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-autoplay', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideDown( 'fast' );
				}
				break;
		}
	});
	
	/**
	 * Manage the attributes GUI based on the "style" attribte value. Used for date fields.
	 *
	 * @since m2m
	 */
	$( document ).on( 'change', '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-style]', function() {
		var metaType = $( '#js-types-shortcode-gui-dialog-container-shortcode input[name=metaType]' ).val(),
			checkedValue = $( '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-style]:checked' ).val(),
			dialogContainer = $( '#js-types-shortcode-gui-dialog-container-shortcode' );
		
		switch ( metaType ) {
			case 'date':
				if ( 'calendar' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:format', dialogContainer ).slideUp( 'fast' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-format input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
				}
				break;
		}
		
	});
	
	/**
	 * Manage the attributes GUI based on the "size" attribte value. Used for image fields.
	 *
	 * @since m2m
	 */
	$( document ).on( 'change', '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-size]', function() {
		var metaType = $( '#js-types-shortcode-gui-dialog-container-shortcode input[name=metaType]' ).val(),
			checkedValue = $( '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-size]:checked' ).val(),
			dialogContainer = $( '#js-types-shortcode-gui-dialog-container-shortcode' );
		
		switch ( metaType ) {
			case 'image':
				if ( 'custom' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-group-for-sizeCombo', dialogContainer ).slideUp( 'fast' );
					if ( 'full' == checkedValue ) {
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional', dialogContainer ).slideUp( 'fast' );
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-resize', dialogContainer ).slideUp( 'fast' );
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color', dialogContainer ).slideUp( 'fast' );
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:padding_color', dialogContainer ).slideUp( 'fast' );
					} else {
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional', dialogContainer ).slideDown( 'fast' );
						$( '.js-toolset-shortcode-gui-attribute-wrapper-for-proportional input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
					}
				}
				break;
		}
		
	});
	
	/**
	 * Manage the attributes GUI based on the "proportional" attribte value. Used for image fields.
	 *
	 * @since m2m
	 */
	$( document ).on( 'change', '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-proportional]', function() {
		var metaType = $( '#js-types-shortcode-gui-dialog-container-shortcode input[name=metaType]' ).val(),
			checkedValue = $( '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-proportional]:checked' ).val(),
			dialogContainer = $( '#js-types-shortcode-gui-dialog-container-shortcode' );
		
		switch ( metaType ) {
			case 'image':
				if ( 'true' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-resize', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-resize input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-resize', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:padding_color', dialogContainer ).slideUp( 'fast' );
				}
				break;
		}
		
	});
	
	/**
	 * Manage the attributes GUI based on the "resize" attribte value. Used for image fields.
	 *
	 * @since m2m
	 */
	$( document ).on( 'change', '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-resize]', function() {
		var metaType = $( '#js-types-shortcode-gui-dialog-container-shortcode input[name=metaType]' ).val(),
			checkedValue = $( '#js-types-shortcode-gui-dialog-container-shortcode .js-shortcode-gui-field[name=types-resize]:checked' ).val(),
			dialogContainer = $( '#js-types-shortcode-gui-dialog-container-shortcode' );
		
		switch ( metaType ) {
			case 'image':
				if ( 'pad' == checkedValue ) {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color', dialogContainer ).slideDown( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color input.js-shortcode-gui-field:radio:checked', dialogContainer ).trigger( 'change' );
				} else {
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-padding_color', dialogContainer ).slideUp( 'fast' );
					$( '.js-toolset-shortcode-gui-attribute-wrapper-for-toolsetCombo\\:padding_color', dialogContainer ).slideUp( 'fast' );
				}
				break;
		}
	});
	
	/**
	 * Clean the attributes list from metaXXXX pairs, before composing the shortcode.
	 *
	 * @param shortcodeAttributeValues object
	 *
	 * @since m2m
	 */
	self.cleanTypesAttributes = function( shortcodeAttributeValues ) {
		shortcodeAttributeValues['metaType'] = false;
		shortcodeAttributeValues['metaNature'] = false;
		shortcodeAttributeValues['metaDomain'] = false;
		shortcodeAttributeValues['metaOptions'] = false;
		return shortcodeAttributeValues;
	};
	
	/**
	 * Clean the attributes list based on selected attribute values, before composing the shortcode.
	 *
	 * @param shortcodeAttributeValues object
	 * @param shortcodeData            object
	 *     rawAttributes object Pairs of attributes key and value, without processing
	 *
	 * @since m2m
	 * @todo Split in specific methods per field type
	 */
	self.adjustAttributes = function( shortcodeAttributeValues, shortcodeData ) {
		var rawAttributes = shortcodeData.rawAttributes;
		switch( rawAttributes.metaType ) {
			case 'audio':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['preload'] = false;
					shortcodeAttributeValues['loop'] = false;
					shortcodeAttributeValues['autoplay'] = false;
				}
				break;
			case 'checkbox':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['selectedValue'] = false;
					shortcodeAttributeValues['unselectedValue'] = false;
				}
				break;
			case 'checkboxes':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues = _.pick( shortcodeAttributeValues, function( value, key, object ) {
						return ( ! /selectedValue/.test( key ) );
					});
				}
				break;
			case 'date':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['style'] = false;
					shortcodeAttributeValues['format'] = false;
				} else {
					if ( 
						_.has( shortcodeAttributeValues, 'style' ) 
						&& 'calendar' == shortcodeAttributeValues.style 
					) {
						shortcodeAttributeValues['format'] = false;
					}
				}
				break;
			case 'email':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['title'] = false;
					shortcodeAttributeValues['class'] = false;
					shortcodeAttributeValues['style'] = false;
				}
				break;
			case 'file':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['title'] = false;
					shortcodeAttributeValues['class'] = false;
					shortcodeAttributeValues['style'] = false;
				}
				break;
			case 'image':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& (
						'raw' == shortcodeAttributeValues.output 
						|| 'url' == shortcodeAttributeValues.output 
					)
				) {
					shortcodeAttributeValues['title'] = false;
					shortcodeAttributeValues['alt'] = false;
					shortcodeAttributeValues['align'] = false;
					shortcodeAttributeValues['resize'] = false;
					shortcodeAttributeValues['proportional'] = false;
					shortcodeAttributeValues['padding_color'] = false;
					shortcodeAttributeValues['class'] = false;
					shortcodeAttributeValues['style'] = false;
					if ( 'url' == shortcodeAttributeValues.output ) {
						shortcodeAttributeValues['url'] = 'true';
						shortcodeAttributeValues['output'] = false;
						if ( 'custom' == shortcodeAttributeValues['size'] ) {
							shortcodeAttributeValues['size'] = false;
						}
					} else {
						shortcodeAttributeValues['size'] = false;
						shortcodeAttributeValues['width'] = false;
						shortcodeAttributeValues['height'] = false;
					}
				} else {
					if ( 'custom' != shortcodeAttributeValues['size'] ) {
						shortcodeAttributeValues['width'] = false;
						shortcodeAttributeValues['height'] = false;
					} 
					if ( 'full' == shortcodeAttributeValues['size'] ) {
						shortcodeAttributeValues['resize'] = false;
						shortcodeAttributeValues['proportional'] = false;
						shortcodeAttributeValues['padding_color'] = false;
					} else {
						if ( 'pad' != shortcodeAttributeValues['resize'] ) {
							shortcodeAttributeValues['padding_color'] = false;
						}
					}
				}
				break;
			case 'numeric':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['format'] = false;
				}
				break;
			case 'radio':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues = _.pick( shortcodeAttributeValues, function( value, key, object ) {
						return ( ! /selectedValue/.test( key ) );
					});
				}
				break;
			case 'skype':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['button_style'] = false;
					shortcodeAttributeValues['class'] = false;
					shortcodeAttributeValues['style'] = false;
				}
				break;
			case 'url':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['title'] = false;
					shortcodeAttributeValues['class'] = false;
					shortcodeAttributeValues['style'] = false;
					shortcodeAttributeValues['target'] = false;
				}
				break;
			case 'video':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'raw' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['width'] = false;
					shortcodeAttributeValues['height'] = false;
					shortcodeAttributeValues['poster'] = false;
					shortcodeAttributeValues['preload'] = false;
					shortcodeAttributeValues['loop'] = false;
					shortcodeAttributeValues['autoplay'] = false;
				}
				break;
		}
		return shortcodeAttributeValues;
	};
	
	/**
	 * Adjust the attributes list for the item selector values.
	 *
	 * @param shortcodeAttributeValues object
	 * @param shortcodeData            object
	 *     rawAttributes object Pairs of attributes key and value, without processing
	 *
	 * @since m2m
	 */
	self.adjustTypesMetaSelectorAttributes = function( shortcodeAttributeValues, shortcodeData ) {
		var rawAttributes = shortcodeData.rawAttributes;
		if ( 'users' == rawAttributes['metaDomain'] ) {
			if ( _.has( rawAttributes, 'item' ) ) {
				switch( rawAttributes['item'] ) {
					case 'author':
						shortcodeAttributeValues['user_is_author'] = 'true';
						break;
					case 'current':
					case false:
						shortcodeAttributeValues['current_user'] = 'true';
						break;
					case 'viewloop':
						// No attribute should be added now
						break;
					default:
						shortcodeAttributeValues['user_id'] = rawAttributes.item;
						break;
				}
				shortcodeAttributeValues['item'] = false;
			}
		}
		if ( 'terms' == rawAttributes['metaDomain'] ) {
			if ( 
				_.has( rawAttributes, 'id' ) 
				&& 'viewloop' == rawAttributes['id']
			) {
				shortcodeAttributeValues['id'] = false;
			}
		}
		return shortcodeAttributeValues;
	}
	
	/**
	 * Adjust the composed shortcode for field types that can produce extra shortcodes per option.
	 *
	 * @param craftedShortcode string
	 * @param shortcodeData    object
	 *     shortcode     string The shortcode handle
	 *     attributes    object Pairs of attributes key and value, after processing
	 *     rawAttributes object Pairs of attributes key and value, without processing
	 *
	 * @since m2m
	 * @todo Split for each field type
	 */
	self.adjustComposedShortcodes = function( craftedShortcode, shortcodeData ) {
		var rawAttributes = shortcodeData.rawAttributes,
			shortcodeAttributeValues = shortcodeData.attributes,
			composedShortcode = craftedShortcode;
		switch( rawAttributes.metaType ) {
			case 'checkbox':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'custom' == shortcodeAttributeValues.output 
				) {
					var composedShortcode = '',
					    composedAttributeString = '';
					
					shortcodeAttributeValues['output'] = false;
					
					if ( ! _.has( shortcodeAttributeValues, 'selectedValue' ) ) {
						shortcodeAttributeValues['selectedValue'] = '';
					}
					if ( ! _.has( shortcodeAttributeValues, 'unselectedValue' ) ) {
						shortcodeAttributeValues['unselectedValue'] = '';
					}
					
					_.each( shortcodeAttributeValues, function( value, key ) {
						if ( 
							value 
							&& -1 == _.indexOf( [ 'selectedValue', 'unselectedValue' ], key )
						) {
							composedAttributeString += " " + key + "='" + value + "'";
						}
					});
					
					composedShortcode = "[" + shortcodeData.shortcode
					    + composedAttributeString
						+ ' state="checked"]'
						+ shortcodeAttributeValues['selectedValue'] 
						+ "[/" + shortcodeData.shortcode + "]"
						+ "[" + shortcodeData.shortcode
					    + composedAttributeString
						+ ' state="unchecked"]'
						+ shortcodeAttributeValues['unselectedValue'] 
						+ "[/" + shortcodeData.shortcode + "]";
					
					craftedShortcode = composedShortcode;
				}
				break;
				
			case 'checkboxes':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'custom' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['output'] = false;
					shortcodeAttributeValues['separator'] = false;
					
					var composedShortcode = '',
					    composedAttributeString = '',
						shortcodeAttributeValuesClone = _.clone( shortcodeAttributeValues ),
						metaOptions = $( '.js-toolset-shortcode-gui-attribute-wrapper-for-metaOptions input' ).data( 'metaOptions' ),
						loopIndex = 0;
					
					shortcodeAttributeValuesClone = _.pick( shortcodeAttributeValuesClone, function( value, key, object ) {
						return ( ! /selectedValue/.test( key ) );
					});
					
					_.each( metaOptions, function( value, key  ) {
						if ( _.has( shortcodeAttributeValues, 'selectedValue_' + loopIndex ) ) {
							composedAttributeString = '';
							_.each( shortcodeAttributeValuesClone, function( value, key ) {
								if ( value ) {
									composedAttributeString += " " + key + "='" + value + "'";
								}
							});
							composedShortcode += "[" + shortcodeData.shortcode
								+ composedAttributeString
								+ ' state="checked" option="' + loopIndex + '"]'
								+ shortcodeAttributeValues['selectedValue_' + loopIndex] 
								+ "[/" + shortcodeData.shortcode + "]";
						}
						
						if ( _.has( shortcodeAttributeValues, 'unselectedValue_' + loopIndex ) ) {
							composedAttributeString = '';
							_.each( shortcodeAttributeValuesClone, function( value, key ) {
								if ( value ) {
									composedAttributeString += " " + key + "='" + value + "'";
								}
							});
							composedShortcode += "[" + shortcodeData.shortcode
								+ composedAttributeString
								+ ' state="unchecked" option="' + loopIndex + '"]'
								+ shortcodeAttributeValues['unselectedValue_' + loopIndex] 
								+ "[/" + shortcodeData.shortcode + "]";
						}
						loopIndex++;
					});
					craftedShortcode = composedShortcode;
				}
				break;
			
			case 'radio':
				if ( 
					_.has( shortcodeAttributeValues, 'output' ) 
					&& 'custom' == shortcodeAttributeValues.output 
				) {
					shortcodeAttributeValues['output'] = false;
					
					var composedShortcode = '',
					    composedAttributeString = '',
						shortcodeAttributeValuesClone = _.clone( shortcodeAttributeValues ),
						metaOptions = $( '.js-toolset-shortcode-gui-attribute-wrapper-for-metaOptions input' ).data( 'metaOptions' );
					
					shortcodeAttributeValuesClone = _.pick( shortcodeAttributeValuesClone, function( value, key, object ) {
						return ( ! /selectedValue/.test( key ) );
					});
					
					_.each( metaOptions, function( value, key  ) {
						if ( _.has( shortcodeAttributeValues, 'selectedValue_' + key ) ) {
							composedAttributeString = '';
							_.each( shortcodeAttributeValuesClone, function( value, key ) {
								if ( value ) {
									composedAttributeString += " " + key + "='" + value + "'";
								}
							});
							composedShortcode += "[" + shortcodeData.shortcode
								+ composedAttributeString
								+ ' option="' + key + '"]'
								+ shortcodeAttributeValues['selectedValue_' + key] 
								+ "[/" + shortcodeData.shortcode + "]";
						}
					});
					craftedShortcode = composedShortcode;
				}
				break;
		}
		return craftedShortcode;
	};
	
	/**
	 * Adjust the dialog buttons labels depending on the current GUI action.
	 *
	 * @param dialogData object
	 *     shortcode  string Shortcode name.
	 *     title      string Form title.
	 *     parameters object Optional. Hidden parameters to enforce as attributes for the resulting shortcode.
	 *     overrides  object Optional. Attribute values to override/enforce, mainly when editing a shortcode.
	 *     dialog     dialog jQuery UI dialog object.
	 *
	 * @since m2m
	 */
	self.manageShortcodeDialogButtonpane = function( dialogData ) {
		switch ( Toolset.hooks.applyFilters( 'toolset-filter-get-shortcode-gui-action', '' ) ) {
			case 'save':
				$( '.js-types-shortcode-gui-button-back' ).hide();
				$( '.js-types-shortcode-gui-button-craft .ui-button-text' ).html( types_shortcode_i18n.action.save );
				break;
			case 'create':
			case 'append':
				$( '.js-types-shortcode-gui-button-back' ).show();
				$( '.js-types-shortcode-gui-button-craft .ui-button-text' ).html( types_shortcode_i18n.action.create );
				break;
			case 'edit':
				$( '.js-types-shortcode-gui-button-back' ).hide();
				$( '.js-types-shortcode-gui-button-craft .ui-button-text' ).html( types_shortcode_i18n.action.update );
				break;
			case 'insert':
			default:
				$( '.js-types-shortcode-gui-button-back' ).show();
				$( '.js-types-shortcode-gui-button-craft .ui-button-text' ).html( types_shortcode_i18n.action.insert );
				break;
		}
	};
	
	//--------------------------------
	// Compatibility
	//--------------------------------

	/**
	 * Handle the event that is triggered by Fusion Builder when creating the WP editor instance.
	 *
	 * The event was added as per our request because Fusion Builder does not load the WP editor using
	 * the native PHP function "wp_editor". It creates the WP editor instance on JS, so no PHP actions
	 * to add custom media buttons like ours are available. It generates the media button plus the toolbar that
	 * contains it as javascript objects that it appends to its own template. It offers no way of adding our custom
	 * buttons to it.
	 *
	 * @param event    The actual event.
	 * @param editorId The id of the editor that is being created.
     *
	 * @since m2m
	 */
	$( document ).on( 'fusionButtons', function( event, editorId ) {
		if ( ! types_shortcode_i18n.conditions.plugins.toolsetViews ) {
			self.addTypesButtonToDynamicEditor( editorId );
		}
	});

	/**
	 * Handle the event that is triggered by Toolset Types when creating a WP editor instance.
	 *
	 * The event is fired when a WYSIWYG field is dynamically initialized in the backend.
	 *
	 * @param event			The actual event.
	 * @param editorId		The id of the editor that is being created.
	 *
	 * @since 2.0
	 */
	$( document ).on( 'toolset:types:wysiwygFieldInited', function( event, editorId ) {
		if ( ! types_shortcode_i18n.conditions.plugins.toolsetViews ) {
			self.addTypesButtonToDynamicEditor( editorId );
		}
	});

	/**
	 * Add a Types button dynamically to any native editor that contains a media toolbar, given its editor ID.
	 *
	 * @since m2m
	 */
	self.addTypesButtonToDynamicEditor = function( editorId ) {
		var $mediaButtons = $( '#wp-' + editorId + '-media-buttons' ),
			button = '<span'
				+ ' class="button js-types-in-toolbar"'
				+ ' data-editor="' + editorId + '">'
				+ '<i class="icon-types-logo fa fa-types-custom ont-icon-18 ont-color-gray"></i>'
				+ '<span class="button-label">' + types_shortcode_i18n.title.button + '</span>'
				+ '</span>',
			$typesButton = $( button );

		if ( $mediaButtons.find( '.js-types-in-toolbar' ).length == 0 ) {
			$typesButton.appendTo( $mediaButtons );
		}
	};
	
	/**
	 * Init main method:
	 * - Init API hooks.
	 * - Init templates
	 * - Init dialogs.
	 * - Init the Admin Bar button.
	 *
	 * @since m2m
	 */
	self.init = function() {
		
		self.initHooks()
			.initTemplates()
			.initDialogs()
			.initAdminBarButton();
		
	};

	self.init();
	
}

jQuery( document ).ready( function( $ ) {
	Toolset.Types.shortcodeGUI = new Toolset.Types.shortcodeManager( $ );
});