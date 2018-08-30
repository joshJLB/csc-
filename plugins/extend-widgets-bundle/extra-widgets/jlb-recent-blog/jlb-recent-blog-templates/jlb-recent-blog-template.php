<?php
$image = wp_get_attachment_url($instance['recent_blog_image']);
$title = $instance['recent_blog_title'];
$link = $instance['recent_blog_link_title'];
?>

<div class="recent-blog-widget-container">
    <div class="six-container">
      <div class="blog-section-circle" style="background-image:url('<?=home_url(); ?>/wp-content/uploads/2018/08/YELLOW-CIRCLE-FOR-BLOG.png')">
        <h1><?=$title; ?></h1>
      </div>
      <div class="blog-section blog-section-image" style="background-image:url(<?=$image; ?>)"></div>
      <div class="blog-section blog-section-content">
        <?php
	        $args = array( 'numberposts' => '1' );
            $recentPosts = wp_get_recent_posts( $args );
            $mostRecent = $recentPosts[0];
        ?>
        <div class="blog-section-content-inner">
          <h1><?=$mostRecent['post_title']?></h1>
          <div class="blog-section-body">
            <p><?=$mostRecent['post_content']?></p>
          </div>
          <a href="<?=get_permalink($mostRecent['ID']); ?>"><?=$link?> >></a>
        </div>
      </div>
    </div>
  </div>