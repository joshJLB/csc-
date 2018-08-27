<?php
/*
  Template Name: Default
  The template for displaying Archive pages
*/
get_header(); ?>

<main id="archive-page">
  <?php get_template_part('components/header/child-header-blank'); ?>

  <section class="archive-container">
    <?php
      $args = array( 'posts_per_page' => -1 );
      $query = new WP_Query( $args );
    ?>
    <?php if ( $query->have_posts() ) : ?>
      <?php while ( $query->have_posts() ) : $query->the_post() ?>

        <div class="blog-post">
          <!-- Use same structure from home.php -->
        </div>

    <?php endwhile; endif; ?>
  </section>

</main>

<?php get_footer();
