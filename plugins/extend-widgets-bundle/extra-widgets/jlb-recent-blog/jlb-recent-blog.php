<?php
/*
Widget Name: JLB Recent Blog
Description: This is for the Recent Blog module displayed on the Child Page Mockup.
Author:JLB (Josh Kincheloe)
*/
class JLB_Recent_Blog extends SiteOrigin_Widget {
  function get_template_name($instance) {
    return 'jlb-recent-blog-template';
  }
  function get_template_dir($instance) {
    return 'jlb-recent-blog-templates';
  }
  function initialize() {
    $this->register_frontend_styles(
      array(
        array( 'jlb-recent-blog-css', '/wp-content/plugins/extend-widgets-bundle/css/jlb-recent-blog.min.css', array() ),
      )
    );
    /*
    $this->register_frontend_scripts(
      array(
        array( 'jlb-recent-blog-js', '/wp-content/plugins/extend-widgets-bundle/js/jlb-recent-blog.js', array( 'jquery' ), '1.0')
      )
    );
    */
  }
  function __construct() {
    //Call the parent constructor with the required arguments.
    parent::__construct(
      // The unique id for your widget.
      'jlb-recent-blog',
      // The name of the widget for display purposes.
      __('JLB Recent Blog', 'jlb-recent-blog-text-domain'),
      // The widget_options array, which is passed through to WP_Widget.
      // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
      array(
        'description' => __('JLB Recent Blog', 'jlb-recent-blog-text-domain'),
      ),
      //The base_folder path string.
      plugin_dir_path(__FILE__)
    );
  }
  function get_widget_form() {
    // https://siteorigin.com/docs/widgets-bundle/form-building/form-fields/
    return array(
      // put all fields here
        'recent_blog_image' => array(
          'type' => 'media',
          'label' => __('Choose an Image', 'widget-form-fields-text-domain'),
          'choose' => __( 'Choose image', 'widget-form-fields-text-domain' ),
          'update' => __( 'Set image', 'widget-form-fields-text-domain' ),
          'library' => 'image',
        ),
        'recent_blog_title' => array(
          'type' => 'text',
          'label' => __('Recent Blog Title', 'widget-form-fields-text-domain')
        ),
        'recent_blog_link_title' => array(
          'type' => 'text',
          'label' => __('Link Display Title', 'widget-form-fields-text-domain')
        ),
        
    );
  }
}
siteorigin_widget_register('jlb-recent-blog', __FILE__, 'JLB_Recent_Blog');