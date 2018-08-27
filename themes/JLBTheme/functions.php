<?php
// main_nav register its existence to wordpress
function register_menu() {
	register_nav_menu('primary', __('Primary'));
}
add_action('init', 'register_menu');


// options pages register
if( function_exists('acf_add_options_page') ) {
  acf_add_options_page('General Options');
	acf_add_options_page('Contact Links');
}

// enqueue javascript & css files
function theme_enqueues() {
	// STYLESHEETS
  wp_register_style( 'extra-css', get_template_directory_uri() . '/compiled/extra-css.min.css', false, NULL, 'all' );
	wp_register_style( 'theme-css', get_template_directory_uri() . '/compiled/styles.min.css', false, NULL, 'all' );
	wp_register_style( 'plebian-css', get_template_directory_uri() . '/plebians-css/plebians-stylesheet.css', false, NULL, 'all' );
	// SCRIPTS
  wp_register_script( 'extra-scripts', get_template_directory_uri() . '/compiled/extra-scripts.min.js', array('jquery'), NULL, true );
	wp_register_script( 'scripts-js', get_template_directory_uri() . '/compiled/scripts.min.js', array('jquery'), NULL, true );

	// STYLESHEETS
  wp_enqueue_style( 'extra-css' );
	wp_enqueue_style( 'theme-css' );
	wp_enqueue_style( 'plebian-css' );
	// SCRIPTS
  wp_enqueue_script( 'extra-scripts' );
	wp_enqueue_script( 'scripts-js' );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueues', 100 );

// Example of  creating different media library image sizes to be created on upload of imagery WxH
// add_image_size( 'home-image', 288, 480, true );

//Add support for post featured image_type_to_extension
add_theme_support( 'post-thumbnails' );

// custom widget functions
// include '/custom-functions/widgets/custom-widget-functions.php';
// custom blog functions
// include '/custom-functions/blog/custom-blog-functions.php';

// Register Custom/Dynamic Sidebars
function custom_sidebars() {

  $sidebar1 = array(
		'id'            => 'sidebarAll',
		'class'         => 'sideBar',
		'name'          => __( 'Full Site Sidebar', 'text_domain' ),
	);
	register_sidebar( $sidebar1 );

  $sidebar2 = array(
		'id'            => 'sidebarBlog',
		'class'         => 'sideBar',
		'name'          => __( 'Blog Sidebar', 'text_domain' ),
	);
	register_sidebar( $sidebar2 );

  $sidebar3 = array(
    'id'            => 'sidebarWoo',
		'class'         => 'sideBar',
		'name'          => __( 'Woocommerce Sidebar', 'text_domain' ),
  );
  register_sidebar( $sidebar3 );

}
add_action( 'widgets_init', 'custom_sidebars' );

show_admin_bar(false);


//////////// Exclude pages from WordPress Search
// if (!is_admin()) {
// function wpb_search_filter($query) {
// if ($query->is_search) {
// $query->set('post_type', 'post');
// }
// return $query;
// }
// add_filter('pre_get_posts','wpb_search_filter');
// }


// add this to your theme's functions.php
// give Editor Access to Gravity Forms
function add_grav_forms(){
  $role = get_role('editor');
  $role->add_cap('gform_full_access');
}
add_action('admin_init','add_grav_forms');
