<?php
/*
Plugin Name: Extra Widgets for SiteOrigin by JLB
*/
// Declare widget Folder
function add_my_awesome_widgets_collection($folders){
    $folders[] = plugin_dir_path(__FILE__).'extra-widgets/';
    return $folders;
}
add_filter('siteorigin_widgets_widget_folders', 'add_my_awesome_widgets_collection');

?>
