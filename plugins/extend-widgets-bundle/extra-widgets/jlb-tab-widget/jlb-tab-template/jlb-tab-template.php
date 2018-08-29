<div class="tab-container">
<?php
  $tabs = $instance['a_repeater'];
  $count = 0; ?>
<ul class="nav nav-tabs" role="tablist">
<?php foreach($tabs as $index => $tab) {
  $count++;
  $title = wp_get_attachment_url($tab['image']); ?>
    <!-- <div class="tab-nav-container"> -->
      <li class="nav-item">
        <a class="nav-link <?php if($count == 1) { echo 'active'; }; ?>" data-toggle="tab" href="#tab-<?php echo $count; ?>" role="tab">
          <img src="<?php echo $title; ?>" alt="">
        </a>
      </li>
    <!-- </div> -->
<?php }; ?>
</ul>
<div class="tab-content">
  <?php
    $count2 = 0;
   foreach($tabs as $index => $tab) {
    $count2++;
    $tabTitle = $tab['tab_title'];
    $content = $tab['tab_content'];
  ?>
  <div class="tab-pane <?php if($count2 == 1) { echo 'active'; }; ?>" id="tab-<?php echo $count2; ?>" role="tabpanel">
    <div class="content-holder">
      <h1><?=$tabTitle?></h1>
      <?php echo $content; ?>
    </div>
  </div>
<?php }; ?>
</div>
</div>
