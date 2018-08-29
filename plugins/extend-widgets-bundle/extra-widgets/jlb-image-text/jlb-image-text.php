<?php
/*
Widget Name: JLB Image/Text
Description: This is for the Image/Text module displayed on the Child Page Mockup.
Author:JLB (Josh Kincheloe)
*/
class JLB_Image_Text extends SiteOrigin_Widget {
  function get_template_name($instance) {
    return 'jlb-image-text-template';
  }
  function get_template_dir($instance) {
    return 'jlb-image-text-templates';
  }
  function initialize() {
    $this->register_frontend_styles(
      array(
        array( 'jlb-image-text-css', '/wp-content/plugins/extend-widgets-bundle/css/jlb-image-text.min.css', array() ),
      )
    );
    /*
    $this->register_frontend_scripts(
      array(
        array( 'jlb-image-text-js', '/wp-content/plugins/extend-widgets-bundle/js/jlb-image-text.js', array( 'jquery' ), '1.0')
      )
    );
    */
  }
  function __construct() {
    //Call the parent constructor with the required arguments.
    parent::__construct(
      // The unique id for your widget.
      'jlb-image-text',
      // The name of the widget for display purposes.
      __('JLB Image/Text', 'jlb-image-text-text-domain'),
      // The widget_options array, which is passed through to WP_Widget.
      // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
      array(
        'description' => __('JLB Image/Text', 'jlb-image-text-text-domain'),
      ),
      //The base_folder path string.
      plugin_dir_path(__FILE__)
    );
  }
  function get_widget_form() {
    // https://siteorigin.com/docs/widgets-bundle/form-building/form-fields/
    return array(
      // put all fields here
        'image' => array(
          'type' => 'media',
          'label' => __('Choose an Image', 'widget-form-fields-text-domain'),
          'choose' => __( 'Choose image', 'widget-form-fields-text-domain' ),
          'update' => __( 'Set image', 'widget-form-fields-text-domain' ),
          'library' => 'image',
        ),
        'image-text' => array(
          'type' => 'text',
          'label' => __('Image Text', 'widget-form-fields-text-domain')
        ),
        'image-content' => array(
          'type' => 'tinymce',
          'label' => __('Image Content', 'widget-form-fields-text-domain'),
          'default_editor' => 'tmce'
        ),
    );
  }
}
siteorigin_widget_register('jlb-image-text', __FILE__, 'JLB_Image_Text');