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
            
            <?php if (is_shop()) : ?>
                <div class="woo-sidebar">
                    <?php dynamic_sidebar('woo-sidebar'); ?> 
                
                    <div class="mobile-shop-sidebar" id="mobile-shop-sidebar">
                        <nav class="shop-sidebar-container">
                            <?php dynamic_sidebar('woo-sidebar'); ?>
                        </nav>
                    </div>
                    <div class="mobile-shop-button">
                        <div class="button-container">
                            <i class="fas fa-search shop-bar1 shop-bar"></i>
                            <i class="fas fa-arrow-circle-right shop-bar2 shop-bar"></i>
                            <!-- <div class="shop-bar1 shop-bar"></div>
                            <div class="shop-bar2 shop-bar"></div>
                            <div class="shop-bar3 shop-bar"></div> -->
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Set Content Layout -->
            <div class="woocommerce">
                <?php woocommerce_content(); ?>
            </div>
        </div>
  </div>
</main>

<?php get_footer();