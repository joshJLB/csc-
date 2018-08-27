<?php

/*
Widget Name: JLB Counter Widget
Description: This is a counter widget.
Author:JLB (Bill Goff)
*/

class JLB_Counter_Widget extends SiteOrigin_Widget {

  function get_template_name($instance) {
      return 'jlb-counter-template';
  }

  function get_template_dir($instance) {
      return 'jlb-counter-templates';
  }
  function initialize() {
      $this->register_frontend_scripts(
          array(
              array( 'jlb-counter-js', '/wp-content/plugins/extend-widgets-bundle/js/jlb-counter.js', array( 'jquery' ), '1.0')
          )
      );
  }

    function __construct() {
        //Here you can do any preparation required before calling the parent constructor, such as including additional files or initializing variables.

        //Call the parent constructor with the required arguments.
        parent::__construct(
            // The unique id for your widget.
            'jlb-counter-widget',

            // The name of the widget for display purposes.
            __('JLB Counter Widget', 'jlb-counter-widget-text-domain'),

            // The $widget_options array, which is passed through to WP_Widget.
            // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
            array(
                'description' => __('JLB Counter Widget', 'jlb-counter-widget-text-domain'),
            ),

            //The $control_options array, which is passed through to WP_Widget
            array(
            ),

            //The $form_options array, which describes the form fields used to configure SiteOrigin widgets. We'll explain these in more detail later.
            $form_options = array(
              'counter_number_start' => array(
                  'type' => 'number',
                  'label' => __( 'Counter Start', 'widget-form-fields-text-domain' ),
                  'default' => '0'
                ),
                'counter_number_end' => array(
                    'type' => 'number',
                    'label' => __( 'Counter End', 'widget-form-fields-text-domain' ),
                    'default' => '250'
                ),
                'counter_speed' => array(
                    'type' => 'number',
                    'label' => __( 'Counter Speed', 'widget-form-fields-text-domain' ),
                    'default' => '2500'
                ),
                'heading' => array(
                    'type' => 'select',
                    'label' => __( 'Font Style', 'widget-form-fields-text-domain' ),
                    'default' => 'h1',
                    'options' => array(
                        'h1' => __( 'Heading One', 'widget-form-fields-text-domain' ),
                        'h2' => __( 'Heading Two', 'widget-form-fields-text-domain' ),
                        'h3' => __( 'Heading Three', 'widget-form-fields-text-domain' ),
                        'h4' => __( 'Heading Four', 'widget-form-fields-text-domain' ),
                        'h5' => __( 'Heading Five', 'widget-form-fields-text-domain' ),
                        'h6' => __( 'Heading Six', 'widget-form-fields-text-domain' ),
                        'p' => __( 'Paragraph', 'widget-form-fields-text-domain' ),
                    )
                ),
                'position' => array(
                    'type' => 'select',
                    'label' => __( 'Text Alignment', 'widget-form-fields-text-domain' ),
                    'default' => 'center',
                    'options' => array(
                        'center' => __( 'Center', 'widget-form-fields-text-domain' ),
                        'left' => __( 'Left', 'widget-form-fields-text-domain' ),
                        'right' => __( 'Right', 'widget-form-fields-text-domain' ),
                    )
                ),

            ),



            //The $base_folder path string.
            plugin_dir_path(__FILE__)
        );


    }

}

siteorigin_widget_register('jlb-counter-widget', __FILE__, 'JLB_Counter_Widget');
?>
