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

</main>

<?php get_footer();
