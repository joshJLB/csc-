<?php
$repeater = $instance['logo_repeater'];
?>
<div class="logo-hover-container">
  <?php foreach($repeater as $index => $slide){
    $linkText = $slide['link_text'];
    $link = $slide['link'];
    $imageID = $slide['logo_media'];
    $imageURL = wp_get_attachment_url($imageID);
    $display = <<<HTML
  <div class="logo-holder">
    <div class="logo-inner">
      <div class="image-holder" style="background-image:url($imageURL);"></div>
      <div class="text-holder">
        <a target="_blank" href="$link"><h5>$linkText</h5></a>
      </div>
    </div>
  </div>
HTML;
  echo $display;
 }; ?>
</div>
