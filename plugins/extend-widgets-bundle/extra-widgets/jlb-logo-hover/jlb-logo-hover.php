<?php

/*
Widget Name: JLB Logo Hover
Description: This is for the logo hover module displayed on the Child Page Mockup.
Author:JLB (Bill Goff)
*/

class JLB_Logo_Hover extends SiteOrigin_Widget {

  function get_template_name($instance) {
      return 'jlb-logo-hover-template';
  }

  function get_template_dir($instance) {
      return 'jlb-logo-hover-templates';
  }
  function initialize() {

      $this->register_frontend_styles(
          array(
              array( 'jlb-logo-hover-css', '/wp-content/plugins/extend-widgets-bundle/css/jlb-logo-hover.css', array() )
          )
      );
  }
    function __construct() {
        //Here you can do any preparation required before calling the parent constructor, such as including additional files or initializing variables.

        //Call the parent constructor with the required arguments.
        parent::__construct(
            // The unique id for your widget.
            'jlb-logo-hover',

            // The name of the widget for display purposes.
            __('JLB Logo Hover', 'jlb-logo-hover-text-domain'),

            // The $widget_options array, which is passed through to WP_Widget.
            // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
            array(
                'description' => __('JLB Logo Hover', 'jlb-logo-hover-text-domain'),
            ),

            //The $control_options array, which is passed through to WP_Widget
            array(
            ),

            //The $form_options array, which describes the form fields used to configure SiteOrigin widgets. We'll explain these in more detail later.
            $form_options = array(
                'logo_repeater' => array(
                    'type' => 'repeater',
                    'label' => __( 'Logos' , 'widget-form-fields-text-domain' ),
                    'item_name'  => __( 'Logo', 'siteorigin-widgets' ),
                    'fields' => array(

                      'logo_media' => array(
                        'type' => 'media',
                        'label' => __( 'Image', 'widget-form-fields-text-domain' ),
                        'choose' => __( 'Choose image', 'widget-form-fields-text-domain' ),
                        'update' => __( 'Set image', 'widget-form-fields-text-domain' ),
                        'library' => 'image',
                        'fallback' => true,
                    ),

                            'link_text' => array(
                                'type' => 'text',
                                'label' => __( 'Link Text', 'widget-form-fields-text-domain' )
                            ),

                            'link' => array(
                                'type' => 'text',
                                'label' => __( 'Link', 'widget-form-fields-text-domain' )
                            ),
                    )
                )
            ),



            //The $base_folder path string.
            plugin_dir_path(__FILE__)
        );
    }


}

siteorigin_widget_register('jlb-logo-hover', __FILE__, 'JLB_Logo_Hover');




?>
