<?php
/**
* Template Name: Child Header
*
* child-header.php
*
*/ ?>

<?php
  $c = get_field('child_header');
  $h = get_field('child_header','option');
?>

<div class="child-header" <?php if ($c): ?>style="background-image: url('<?php echo $c; ?>');"<?php else: ?>style="background-image: url('<?php echo $h; ?>');"<?php endif; ?>>
  <div class="child-title-wrapper">
    <?php if (is_home()): ?>
      <h1 class="title">Blog</h1> 
    <?php elseif (is_single()): ?>
        <h1 class="title"><?php echo get_the_title(); ?></h1>
      <!-- Anything else for single page child header here -->
    <?php elseif (is_shop()): ?>
      <h1 class="title"><a href="javascript:history.back();">Shop</a></h1>  
    <?php else: ?>
      <h1 class="title"><?php echo get_the_title(); ?></h1>
    <?php endif; ?>
  </div>
</div>
