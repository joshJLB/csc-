<?php
/*
*
* hero.php
*
*/
?>

<?php
  // Hero Section Variables
  // $hero_background = get_field('hero_background');
  // $hero_video = get_field('hero_video');
  // $hero_slider = get_field('hero_slider');
?>
<?php if (!$hero_video && !$hero_slider): ?>
  <section class="hero" style="background-image: url('<?php echo $hero_background['url']; ?>');" title="<?php echo $hero_background['alt']; ?>">
    <!-- Add Content Here for Static Background -->
<?php else: ?>
  <section class="hero">
    <?php if ( have_rows('hero_slider') ): ?>
      <div class="hero-slider">
        <?php while ( have_rows('hero_slider') ): the_row();
        //vars
          $b = get_sub_field('background');
        ?>

          <!-- Hero Slider Slides -->
          <div class="hero-slide" style="background-image: url('<?php echo $b['url']; ?>');" title="<?php echo $b['alt']; ?>"></div>

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
