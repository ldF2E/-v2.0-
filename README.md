# 在线开发平台帮助文档

## 平台功能简介
## 开发者与系统管理员
## 应用的概念与分类

## 模板语言freeMarker
## 如何创建一个应用

## 组件开发攻略
	### 组件后台设置项
	### html（freemaker）代码
	### 静态资源 css js 与 图片管理
	### css与js引用
	### 国际化文本

## 区块开发攻略
	### html（freemaker）代码
	### 静态资源 css js 与 图片管理
	### css与js引用
	### 静态模板与动态数据模板
	### 国际化文本


## 示例代码
<pre>
<div class="backstage-blocksEditor-wrap" data-wrap-type="1" data-storage="0" data-blocksEditor-type="phoenix_blocks_text">
	<div class="text">text</div>
</div>

<div class="backstage-blocksEditor-wrap" data-wrap-type="1" data-storage="0" data-blocksEditor-type="phoenix_blocks_button">
	<div class="backstage-componet">
        <div class="backstage-componet-bd">
            <a class="blocks-button" href="javascript:;">SUBMIT</a>
		</div>
	</div>
</div>

<div class="backstage-blocksEditor-wrap" data-wrap-type="1" data-storage="0" data-blocksEditor-type="phoenix_blocks_image">
	<div class="backstage-componet">
        <div class="backstage-componet-bd">
            <a class="blocks-image" href="javascript:;"><img src="http://a0.leadongcdn.cn/cloud/jnBnkKRqjSijpijn/MACHINERY8.png" alt="" title=""></a>
		</div>
	</div>
</div>

[@web_javascript]
	$(function() {
	    console.log($("#siteblocks-setting-wrap-${componentBlock.settingId!} .banner").length)
	});
[/@web_javascript]
</pre>
