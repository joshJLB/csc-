<?php

/**
 * Class WPV_Shortcode_Post_Date
 *
 * @since 2.5.0
 */
class WPV_Shortcode_Post_Date implements WPV_Shortcode_Interface {

	const SHORTCODE_NAME = 'wpv-post-date';

	/**
	 * @var array
	 */
	private $shortcode_atts = array(
		'item'         => null, // post
		'id'           => null, // synonym for 'item'
		'post_id'      => null, // synonym for 'item'
		'format'       => null, // date format
		'type'         => 'created' // 'created'|'modified'
	);

	/**
	 * @var string|null
	 */
	private $user_content;
	
	/**
	 * @var array
	 */
	private $user_atts;


	/**
	 * @var Toolset_Shortcode_Attr_Interface
	 */
	private $item;

	/**
	 * WPV_Shortcode_Post_Date constructor.
	 *
	 * @param Toolset_Shortcode_Attr_Interface $item
	 */
	public function __construct(
		Toolset_Shortcode_Attr_Interface $item
	) {
		$this->item  = $item;
		
		$this->shortcode_atts['format'] = get_option( 'date_format' );
	}

	/**
	* Get the shortcode output value.
	*
	* @param $atts
	* @param $content
	*
	* @return string
	*
	* @since 2.5.0
	*/
	public function get_value( $atts, $content = null ) {
		$this->user_atts    = shortcode_atts( $this->shortcode_atts, $atts );
		$this->user_content = $content;

		if ( ! $item_id = $this->item->get( $this->user_atts ) ) {
			// no valid item
			throw new WPV_Exception_Invalid_Shortcode_Attr_Item();
		}
		
		$out = '';
		
		$item = get_post( $item_id );

		// Adjust for WPML support
		// If WPML is enabled, $item_id should contain the right ID for the current post in the current language
		// However, if using the id attribute, we might need to adjust it to the translated post for the given ID
		$item_id = apply_filters( 'translate_object_id', $item_id, $item->post_type, true, null );
		
		$type = strtolower( $this->user_atts['type'] );

		if ( $type == "created" ) {
			$out = apply_filters('the_time', get_the_time( $this->user_atts['format'], $item_id ) );
		} elseif ( $type == "modified" ) {
			$out = apply_filters('the_modified_time', get_the_modified_time( $this->user_atts['format'], $item_id ) );
		}

		apply_filters( 'wpv_shortcode_debug', 'wpv-post-date', json_encode( $this->user_atts ), '', 'Data received from cache, filter the_time applied', $out );

		return $out;
	}
	
	
}