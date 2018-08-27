<?php

/*
Widget Name: Testimonial Slider Widget
Description: This is for the Testimonial Slider displayed on the Child Page Mockup.
Author:JLB (Bill Goff)
*/

class Testimonial_Slider_Widget extends SiteOrigin_Widget {

  function get_template_name($instance) {
      return 'testimonial-slider-template';
  }

  function get_template_dir($instance) {
      return 'testimonial-slider-templates';
  }


  function initialize() {
      $this->register_frontend_scripts(
          array(
              array( 'testimonial-slider-js', '/wp-content/plugins/extend-widgets-bundle/js/testimonial-slider.js', array( 'jquery' ))
          )
      );
      $this->register_frontend_styles(
          array(
              array( 'testimonial-slider-css', '/wp-content/plugins/extend-widgets-bundle/css/testimonial-slider.css', array() )
          )
      );
  }
    function __construct() {
        //Here you can do any preparation required before calling the parent constructor, such as including additional files or initializing variables.

        //Call the parent constructor with the required arguments.
        parent::__construct(
            // The unique id for your widget.
            'testimonial-slider-widget',

            // The name of the widget for display purposes.
            __('Testimonial Slider', 'testimonial-slider-widget-text-domain'),

            // The $widget_options array, which is passed through to WP_Widget.
            // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
            array(
                'description' => __('Testimonial Slider', 'testimonial-slider-widget-text-domain'),
            ),

            //The $control_options array, which is passed through to WP_Widget
            array(
            ),

            //The $form_options array, which describes the form fields used to configure SiteOrigin widgets. We'll explain these in more detail later.
            $form_options = array(
                'testimonial_repeater' => array(
                    'type' => 'repeater',
                    'label' => __( 'Repeater for testimonials' , 'widget-form-fields-text-domain' ),
                    'item_name'  => __( 'Slide', 'siteorigin-widgets' ),
                    'fields' => array(
                        'testimonial_name' => array(
                            'type' => 'text',
                            'label' => __( 'Name', 'widget-form-fields-text-domain' )
                        ),

                        'testimonial_sub' => array(
                            'type' => 'text',
                            'label' => __( 'Subtext', 'widget-form-fields-text-domain' )
                        ),
                        'testimonial_content' => array(
                            'type' => 'textarea',
                            'label' => __( 'Type a message', 'widget-form-fields-text-domain' ),
                            'rows' => 10
                        ),
                    )
                )
            ),
            //The $base_folder path string.
            plugin_dir_path(__FILE__)
        );
    }
}


siteorigin_widget_register('testimonial-slider-widget', __FILE__, 'Testimonial_Slider_Widget');


?>
