<?php
/*
  Template Name: Child 2
  child-2.php
*/
get_header(); ?>

<main id="child-2">
  <?php get_template_part('components/header/child-header'); ?>

  <div class="child-container">
    <?php if ( have_posts() ): ?>
      <?php while ( have_posts() ): the_post(); ?>

        <?php the_content(); ?>

    <?php endwhile; wp_reset_postdata(); endif; ?>
  </div>
</main>

<?php get_footer();
