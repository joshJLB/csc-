<?php
$repeater = $instance['testimonial_repeater'];
?>
<div class="slider-container">
<div class="testimonial-slider">
  <?php foreach($repeater as $index => $slide){
    $name = $slide['testimonial_name'];
    $sub = $slide['testimonial_sub'];
    $content = $slide['testimonial_content'];
    $display = <<<HTML
  <div>
    <div class="slide-inner">
      <p>$content</p>
      <h3>$name</h3>
      <h4>$sub</h4>
    </div>
  </div>
HTML;
  echo $display;
 }; ?>
</div>
</div>
