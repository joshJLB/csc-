<?php

/*
Widget Name: JLB Feature Cards
Description: This is for feature module displayed on the Child Page Mockup.
Author:JLB (Bill Goff)
*/

class JLB_Feature_Cards extends SiteOrigin_Widget {

  function get_template_name($instance) {
      return 'jlb-feature-cards-template';
  }

  function get_template_dir($instance) {
      return 'jlb-feature-cards-templates';
  }
  function initialize() {

      $this->register_frontend_styles(
          array(
              array( 'jlb-feature-cards', '/wp-content/plugins/extend-widgets-bundle/css/jlb-feature-cards.css', array() )
          )
      );
  }
    function __construct() {
        //Here you can do any preparation required before calling the parent constructor, such as including additional files or initializing variables.

        //Call the parent constructor with the required arguments.
        parent::__construct(
            // The unique id for your widget.
            'jlb-feature-cards',

            // The name of the widget for display purposes.
            __('JLB Feature Cards', 'jlb-feature-cards-text-domain'),

            // The $widget_options array, which is passed through to WP_Widget.
            // It has a couple of extras like the optional help URL, which should link to your sites help or support page.
            array(
                'description' => __('JLB Tabs.', 'jlb-feature-cards-text-domain'),
            ),

            //The $control_options array, which is passed through to WP_Widget
            array(
            ),

            //The $form_options array, which describes the form fields used to configure SiteOrigin widgets. We'll explain these in more detail later.
            $form_options = array(
                'card_repeater' => array(
                    'type' => 'repeater',
                    'label' => __( 'Cards' , 'widget-form-fields-text-domain' ),
                    'item_name'  => __( 'Card', 'siteorigin-widgets' ),
                    'fields' => array(
                        'title_text' => array(
                            'type' => 'text',
                            'label' => __( 'Title Text', 'widget-form-fields-text-domain' )
                        ),
                        'card_text' => array(
                            'type' => 'textarea',
                            'label' => __( 'Card Text', 'widget-form-fields-text-domain' ),
                            'rows' => 10,
                          ),
                            'link_text' => array(
                                'type' => 'text',
                                'label' => __( 'Link Text', 'widget-form-fields-text-domain' )
                            ),

                            'link' => array(
                                'type' => 'text',
                                'label' => __( 'Link', 'widget-form-fields-text-domain' )
                            ),
                            'card_media' => array(
                              'type' => 'media',
                              'label' => __( 'Image', 'widget-form-fields-text-domain' ),
                              'choose' => __( 'Choose image', 'widget-form-fields-text-domain' ),
                              'update' => __( 'Set image', 'widget-form-fields-text-domain' ),
                              'library' => 'image',
                              'fallback' => true,
                          )
                    )
                )
            ),



            //The $base_folder path string.
            plugin_dir_path(__FILE__)
        );
    }


}

siteorigin_widget_register('jlb-feature-cards', __FILE__, 'JLB_Feature_Cards');




?>
