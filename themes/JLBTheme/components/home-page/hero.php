<?php
/*
*
* hero.php
*
*/
?>

<?php
  // Hero Section Variables
  $hero_background = get_field('hero_background');
  $hero_video = get_field('hero_video');
  $hero_slider = get_field('hero_slider');
?>
<?php if (!$hero_video && !$hero_slider): ?>
  <section class="hero" style="background-image: url('<?php echo $hero_background['url']; ?>');" title="<?php echo $hero_background['alt']; ?>">
    <!-- Add Content Here for Static Background -->
    <h1>hello</h1>
<?php else: ?>
  <section class="hero">
    
      <?php if ( have_rows('hero_slider') ): ?>
        <div class="hero-slider">
          <?php while ( have_rows('hero_slider') ): the_row();
          //vars
            // $b = get_sub_field('background');
          ?>

            <!-- Hero Slider Slides -->
            <div class="hero-slide" style="background-image: url(<?=get_sub_field('background'); ?>);" title="<?=get_sub_field('title'); ?>">
              <div class="hero-content-wrapper">
                <div class="overlay"></div> 
                <div class="hero-content">
                  <h1><?=get_sub_field('title'); ?></h1>
                  <p><?=get_sub_field('body'); ?></p>
                  <a href="<?=get_sub_field('link'); ?>"><?=get_sub_field('hero_link_text'); ?> >></a>
                  </div>
              </div>
            </div>

          <?php endwhile; wp_reset_postdata(); ?>
        </div>
      <?php else: ?>
        <video src="<?php echo $hero_video; ?>" autoplay mute loop></video>
        <div class="hero-content">
          <!-- Add Content Here for Video -->
        </div>
      <?php endif; ?>
    <?php endif; ?>
  
</section>
