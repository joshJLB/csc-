<?php
/*
  Template Name: Woocommerce
  page.php (the Template for displaying all single posts)
*/
get_header(); ?>

<main id="page-template">
  <?php get_template_part('components/header/child-header'); ?>

  <div class="page-container">
        <div class="woocommerce-page-container">
            
            <!-- Set Content Layout -->
            <div class="woocommerce">
                <?php woocommerce_content(); ?>
            </div>
            <?php if (is_shop()) : ?>
                <div class="woo-sidebar">
                    <?php dynamic_sidebar('woo-sidebar'); ?> 
                </div>
            <?php endif; ?>
        </div>
  </div>
</main>

<?php get_footer();