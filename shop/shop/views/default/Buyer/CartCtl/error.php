<html>
<head>
<style>
    h1 {
        position: absolute;
        top: 23%;
        left: 43%;
    }
</style>
<script type="text/javascript" src="<?= $this->view->js_com ?>/jquery.js" charset="utf-8"></script>
</head>
<body>
<h1><?php echo $error ? $error : __('购物车中无此商品'); ?></h1>
</body>
</html>
<script>
    setTimeout('window.history.back()', 3000);
</script>

