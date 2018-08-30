<?php
/*
Widget Name: JLB Slider Widget
Description: This is for the Slider Widget module displayed on the Child Page Mockup.
Author:JLB (Josh Kincheloe)
*/
class JLB_Slider_Widget extends SiteOrigin_Widget {
  function get_template_name($instance) {
    return 'jlb-slider-widget-template';
  }
  function get_template_dir($instance) {
    return 'jlb-slider-widget-templates';
  }
  function initialize() {
    $this->register_frontend_styles(
      array(
        array( 'jlb-slider-widget-css', '/wp-content/plugins/extend-widgets-bundle/css/jlb-slider-widget.min.css', array() ),
      )
    );
    /*
    $this->register_frontend_scripts(
      array(
        array( 'jlb-slider-widget-js', '/wp-content/plugins/extend-widgets-bundle/js/jlb-slider-widget.js', array( 'jquery' ), '1.0')
      )
    );
    */
  }
  function __construct() {
    //Call the parent constructor with the required arguments.
    parent::__construct(
      // The unique id for your widget.
      'jlb-slider-widget',
      // The name of the widget for display purposes.
      __('JLB Slider Widget', 'jlb-slider-widget-text-domain'),
      // The  array, which is passed through to WP_Widget.
      // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
      array(
        'description' => __('JLB Slider Widget', 'jlb-slider-widget-text-domain'),
      ),
      //The  path string.
      plugin_dir_path(__FILE__)
    );
  }
  function get_widget_form() {
    // https://siteorigin.com/docs/widgets-bundle/form-building/form-fields/
    return array(
      // put all fields here
        'slider_image' => array(
          'type' => 'media',
          'label' => __('Choose an Image', 'widget-form-fields-text-domain'),
          'choose' => __( 'Choose image', 'widget-form-fields-text-domain' ),
          'update' => __( 'Set image', 'widget-form-fields-text-domain' ),
          'library' => 'image',
        ),
        'slider_title' => array(
          'type' => 'text',
          'label' => __('Slider Title', 'widget-form-fields-text-domain')
        ),
        'slider_widget_repeater' => array(
          'type' => 'repeater',
          'label' => __('', 'widget-form-fields-text-domain'),
          'item_name' => __('', 'widget-form-fields-text-domain'),
          'fields' => array(
            'slider_body' => array(
              'type' => 'textarea',
              'label' => __( 'Slider Body', 'widget-form-fields-text-domain' ),
              'default' => 'Text Area',
              'rows' => 10
            ),
            'slider_author' => array(
              'type' => 'text',
              'label' => __('Slider Author', 'widget-form-fields-text-domain')
            ),
          )
        ),
    );
  }
}
siteorigin_widget_register('jlb-slider-widget', __FILE__, 'JLB_Slider_Widget');