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

</main>

<?php get_footer();
