<?php
/*
  Template Name: Home Page
  front-page.php
*/
get_header(); ?>

<main id="home">

  <?php get_template_part('components/home-page/hero'); ?>
  <!-- Or, nah -->
  <section class="hero"></section>

  <!-- Continue Sections -->

  <section class="one">
    <div class="one-container">
      <div class="courses-homepage">
        <h1><?=get_field('title_one'); ?></h1>
        <p><?=get_field('body_one'); ?></p>
        <a href="<?=get_field('link_url_one'); ?>"><?=get_field('link_display_text_one'); ?> >></a>
      </div>
      <div class="crisis-homepage">
        <h1><?=get_field('title_two'); ?></h1>
        <p><?=get_field('body_two'); ?></p>
        <a href="<?=get_field('link_url_two'); ?>"><?=get_field('link_display_text_two'); ?> >></a>
      </div>
    </div>
  </section>

  <section class="two">
    <div class="two-container">
      <div class="our-story">
        <h1><?=get_field('info_title_one'); ?></h1>
        <p><?=get_field('info_body_one'); ?></p>
        <a href="<?=get_field('info_url_one'); ?>"><?=get_field('info_link_text_one'); ?> >></a>
        <div class="info-image-one" style="background-image:url(<?=get_field('info_image_one'); ?>)"></div>
      </div>
      <div class="quick-facts">
        <h1><?=get_field('info_title_two'); ?></h1>
        <p><?=get_field('info_body_two'); ?></p>
        <a href="<?=get_field('info_url_two'); ?>"><?=get_field('info_link_text_two'); ?> >></a>
        <div class="info-image-two" style="background-image:url(<?=get_field('info_image_two'); ?>)"></div>
      </div>
    </div>
  </section>

  <section class="three">
    <div class="three-container">
      <div class="about-image" style="background-image:url(<?=get_field('about_image'); ?>)"></div>
      <div class="about-content">
        <h1><?=get_field('about_title'); ?></h1>
        <p><?=get_field('about_body'); ?></p>

        <?php if(get_field('about_repeater')): ?>
        <?php while( have_rows('about_repeater') ): the_row();?>
          <div class="certification-container">
            <img src="<?=get_sub_field('about_image_one'); ?>" alt="" class="certification-images">
            <img src="<?=get_sub_field('about_image_two'); ?>" alt="" class="certification-images">
            <img src="<?=get_sub_field('about_image_three'); ?>" alt="" class="certification-images">
            <img src="<?=get_sub_field('about_image_four'); ?>" alt="" class="certification-images">
          </div>
        <?php endwhile; ?>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <section class="four">
    <div class="four-container" style="background-image:url(<?=get_field('testimonial_image'); ?>)">
        <div class="testimonial-title">
          <h1><?=get_field('testimonial_title'); ?></h1>
        </div>
        <div class="testimonial-slider">
          <?php if(get_field('testimonial_slider')): ?>
          <?php while( have_rows('testimonial_slider') ): the_row();?>
            <div class="slide">
              <div class="slide-inner">
                <p class="testimonial-paragraph"><?=get_sub_field('testimonial_body'); ?></p>
              </div>
              <h3><?=get_sub_field('testimonial_author'); ?></h3>
            </div>
          <?php endwhile; ?>
          <?php endif; ?>
        </div>
    </div>
  </section>

  <section class="five">
    <div class="five-container">
      <h1><?=get_field('course_title'); ?></h1>
      <div class="courses-list">
        <?php if(get_field('course_repeater')): ?>
        <?php while( have_rows('course_repeater') ): the_row();?>
          <div class="course-card">
            <img src="<?=get_sub_field('course_image'); ?>" alt="">
            <h2><?=get_sub_field('course_title'); ?></h2>
            <a href="<?=get_sub_field('course_url'); ?>"><?=get_sub_field('course_url_text'); ?> >></a>
          </div>
        <?php endwhile; ?>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <section class="six">
    <div class="six-container">
      <div class="blog-section-circle" style="background-image:url('http://localhost/wp-content/uploads/2018/08/YELLOW-CIRCLE-FOR-BLOG.png')">
        <h1><?=get_field('blog_section_title'); ?></h1>
      </div>
      <div class="blog-section blog-section-image" style="background-image:url(<?=get_field('blog_section_image'); ?>)"></div>
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
          <a href="<?=get_permalink($mostRecent['ID']); ?>"><?=get_field('blog_section_button_text'); ?> >></a>
        </div>
      </div>
    </div>
  </section>

</main>

<?php get_footer();
