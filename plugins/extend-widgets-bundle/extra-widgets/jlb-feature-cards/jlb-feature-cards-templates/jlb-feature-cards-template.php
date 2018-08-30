<?php
$repeater = $instance['card_repeater'];
$cardTitle = $instance['card_title']
?>
<div class="card-container">
<h1><?=$cardTitle?></h1>
  <div class="card-container-inner">
    <?php foreach($repeater as $index => $slide){
      $cardTitle = $slide['title_text'];
      $cardText = $slide['card_text'];
      $linkText = $slide['link_text'];
      $link = $slide['link'];
      $imageID = $slide['card_media'];
      $imageURL = wp_get_attachment_url($imageID);
    ?>
      
    <div class="card-holder">
      <div class="card-inner">
        <div class="image-holder" style="background-image:url(<?=$imageURL?>);"></div>
        <div class="text-holder">
          <h2><?=$cardTitle?></h2>
          <p><?=$cardText?></p>
          <a href="<?=$link?>"><?=$linkText?> >></a>
        </div>
      </div>
    </div>
  <?php }; ?>
  </div>
</div>
