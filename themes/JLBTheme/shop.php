<?php
/*
  Template Name: Home
  home.php (the Template for displaying all single posts)
*/
get_header(); ?>

<main id="blog-page">
  <?php get_template_part('components/header/child-header'); ?>

  <div class="blog-container">
    <?php
      $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
      $args = array( 'posts_per_page' => '12', 'paged' => $paged );
      $query = new WP_Query( $args );
    ?>
    <?php if ( $query->have_posts() ) : ?>
      <div class="blog-posts">
        <?php while ( $query->have_posts() ) : $query->the_post() ?>

          <div class="blog-post-container">
            <div class="blog-post">
              <h5><?php the_time('F j'); ?></h5>
              <h3><?php the_title(); ?></h3>
              <div class="blog-body">
                <p><?php the_excerpt(); ?></p>
              </div>
              <div class="blog-link">
                <a href="<?=the_permalink()?>">Read More</a>
              </div>
            </div>
          </div>

        <?php endwhile; ?>
      </div>

      <nav class="pagination">
        <div class="content">
          <p><?php previous_posts_link( 'Previous', $query->max_num_pages) ?></p>
          <p><?php next_posts_link( 'Next', $query->max_num_pages) ?></p>
        </div>
      </nav>
    <?php wp_reset_postdata(); endif; ?>

  </div>
</main>

<?php get_footer();
