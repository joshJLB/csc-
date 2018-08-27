<div class="tab-container">
<?php
  $tabs = $instance['a_repeater'];
  $count = 0; ?>
<ul class="nav nav-tabs" role="tablist">
<?php foreach($tabs as $index => $tab) {
  $count++;
  $title = $tab['repeat_text']; ?>
    <li class="nav-item">
      <a class="nav-link <?php if($count == 1) { echo 'active'; }; ?>" data-toggle="tab" href="#tab-<?php echo $count; ?>" role="tab">
        <?php echo $title; ?>
        <div class="arrow-div white-bottom"></div>
        <div class="arrow-div grey-bottom"></div>
      </a>
    </li>
<?php }; ?>
</ul>
<div class="tab-content">
  <?php
    $count2 = 0;
   foreach($tabs as $index => $tab) {
     $count2++;
    $content = $tab['tab_content'];
    $link_text = $tab['link_text'];
    $link = $tab['link'];
  ?>
  <div class="tab-pane <?php if($count2 == 1) { echo 'active'; }; ?>" id="tab-<?php echo $count2; ?>" role="tabpanel">
    <div class="content-holder">
      <?php echo $content; ?>
    </div>
    <a href="<?php echo $link; ?>" class="link-bottom">
      <p><?php echo $link_text; ?></p>
    </a>
  </div>
<?php }; ?>
</div>
</div>
