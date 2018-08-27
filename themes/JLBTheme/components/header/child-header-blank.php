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
  <!-- Leave Blank -->
</div>
